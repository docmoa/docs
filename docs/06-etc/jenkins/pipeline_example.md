---
meta:
  - name: description
    content: jenkins pipeline
tags: ["cicd", "jenkins"]
---

# Pipeline - Jenkins file 예제

## Jenkinsfile

```groovy
// Set your project Prefix
def prefix = "user11"

// Set variable globally to be available in all stages
// Set Maven command to always include Nexus Settings
def mvnCmd = "mvn -s ./nexus_openshift_settings.xml"
// Set Development and Production Project Names
def devProject = "user11-tasks-dev"
def prodProject = "user11-tasks-prod"
// Set the tag for the development image: version + build number
def devTag = "0.0-0"
// Set the tag for the production image: version
def prodTag = "0.0"
def destApp = "tasks-green"
def activeApp = ""

pipeline {
    agent {
        // Using the Jenkins Agent Pod that we defined earlier
        label "maven-appdev"
    }
    stages {
        // Checkout Source Code and calculate Version Numbers and Tags
        stage('Checkout Source') {
            steps {
                // Replace user11-gogs with the name of your Gogs project
                // Replace the credentials with your credentials.
                git credentialsId: 'gogs', url: "http://gogs-${prefix}-gogs.apps.7767.openshift.opentlc.com/CICDLabs/openshift-tasks-private.git"
                // or when using the Pipeline from the repo itself:
                // checkout scm

                script {
                    def pom = readMavenPom file: 'pom.xml'
                    def version = pom.version

                    // Set the tag for the development image: version + build number
                    devTag = "${version}-" + currentBuild.number
                    // Set the tag for the production image: version
                    prodTag = "${version}"
                }
            }
        }

        // Using Maven build the war file
        // Do not run tests in this step
        stage('Build App') {
            steps {
                echo "Building version ${devTag}"
                sh "${mvnCmd} clean package -DskipTests=true"
            }
        }

        // Using Maven run the unit tests
        stage('Unit Tests') {
            steps {
                echo "Running Unit Tests"
                sh "${mvnCmd} test"

                // This next step is optional.
                // It displays the results of tests in the Jenkins Task Overview
                step([$class: 'JUnitResultArchiver', testResults: '**/target/surefire-reports/TEST-*.xml'])
            }
        }

        //Using Maven call SonarQube for Code Analysis
        stage('Code Analysis') {
            steps {
                script {
                    echo "Running Code Analysis"
                    sh "${mvnCmd} sonar:sonar -Dsonar.host.url=http://sonarqube-${prefix}-sonarqube.apps.7767.openshift.opentlc.com/ -Dsonar.projectName=${JOB_BASE_NAME} -Dsonar.projectVersion=${devTag}"
                }
            }
        }

        // Publish the built war file to Nexus
        stage('Publish to Nexus') {
            steps {
                echo "Publish to Nexus"
                sh "${mvnCmd} deploy -DskipTests=true -DaltDeploymentRepository=nexus::default::http://nexus3.${prefix}-nexus.svc.cluster.local:8081/repository/releases"
            }
        }

        // Build the OpenShift Image in OpenShift and tag it.
        stage('Build and Tag OpenShift Image') {
            steps {
                echo "Building OpenShift container image tasks:${devTag}"
                script{
                    def pom = readMavenPom file: 'pom.xml'
                    def version = pom.version

                    sh "oc start-build tasks --follow --from-file=http://nexus3-${prefix}-nexus.apps.7767.openshift.opentlc.com/repository/releases/org/jboss/quickstarts/eap/tasks/${version}/tasks-${version}.war -n ${devProject}"
                    openshiftTag alias: 'false', destStream: 'tasks', destTag: devTag, destinationNamespace: 'user11-tasks-dev', namespace: 'user11-tasks-dev', srcStream: 'tasks', srcTag: 'latest', verbose: 'false'    
                }
                
                // sh "oc start-build tasks --follow --from-file=http://nexus3.${prefix}-nexus.svc.cluster.local:8081/repository/releases/org/jboss/quickstarts/eap/tasks/${devTag}/tasks-${devTag}.war -n ${devProject}"
                // sh "oc start-build tasks --follow --from-file=./target/openshift-tasks.war -n ${devProject}"
                // openshiftTag alias: 'false', destStream: 'tasks', destTag: devTag, destinationNamespace: 'user11-tasks-dev', namespace: 'user11-tasks-dev', srcStream: 'tasks', srcTag: 'latest', verbose: 'false'

                // Start Binary Build in OpenShift using the file we just published
                // The filename is openshift-tasks.war in the 'target' directory of your current
                // Jenkins workspace
                // script {
                //     openshift.withCluster() {
                //         openshift.withProject("${devProject}") {
                //             openshift.selector("bc", "tasks").startBuild("--from-file=./target/openshift-tasks.war", "--wait=true")

                //             // OR use the file you just published into Nexus:
                //             // "--from-file=http://nexus3.${prefix}-nexus.svc.cluster.local:8081/repository/releases/org/jboss/quickstarts/eap/tasks/${version}/tasks-${version}.war"
                //             openshift.tag("tasks:latest", "tasks:${devTag}")
                //         }
                //     }
                // }
            }
        }

        // Deploy the built image to the Development Environment.
        stage('Deploy to Dev') {
            steps {
                echo "Deploying container image to Development Project"
                script {
                    // Update the Image on the Development Deployment Config
                    openshift.withCluster() {
                        openshift.withProject("${devProject}") {
                            openshift.set("image", "dc/tasks", "tasks=docker-registry.default.svc:5000/${devProject}/tasks:${devTag}")

                            // Update the Config Map which contains the users for the Tasks application
                            // (just in case the properties files changed in the latest commit)
                            openshift.selector('configmap', 'tasks-config').delete()
                            def configmap = openshift.create('configmap', 'tasks-config', '--from-file=./configuration/application-users.properties', '--from-file=./configuration/application-roles.properties')

                            // Deploy the development application.
                            openshift.selector("dc", "tasks").rollout().latest();

                            // Wait for application to be deployed
                            def dc = openshift.selector("dc", "tasks").object()
                            def dc_version = dc.status.latestVersion
                            def rc = openshift.selector("rc", "tasks-${dc_version}").object()

                            echo "Waiting for ReplicationController tasks-${dc_version} to be ready"
                            while (rc.spec.replicas != rc.status.readyReplicas) {
                                sleep 10
                                rc = openshift.selector("rc", "tasks-${dc_version}").object()
                            }
                        }
                    }
                }
            }
        }

        // Run Integration Tests in the Development Environment.
        stage('Integration Tests') {
            steps {
                echo "Running Integration Tests"
                script {
                    def status = "000"

                    // Create a new task called "integration_test_1"
                    echo "Creating task"
                    status = sh(returnStdout: true, script: "curl -sw '%{response_code}' -o /dev/null -u 'tasks:redhat1' -H 'Content-Length: 0' -X POST http://tasks.${prefix}-tasks-dev.svc.cluster.local:8080/ws/tasks/integration_test_1").trim()
                    echo "Status: " + status
                    if (status != "201") {
                        error 'Integration Create Test Failed!'
                    }

                    echo "Retrieving tasks"
                    status = sh(returnStdout: true, script: "curl -sw '%{response_code}' -o /dev/null -u 'tasks:redhat1' -H 'Accept: application/json' -X GET http://tasks.${prefix}-tasks-dev.svc.cluster.local:8080/ws/tasks/1").trim()
                    if (status != "200") {
                        error 'Integration Get Test Failed!'
                    }

                    echo "Deleting tasks"
                    status = sh(returnStdout: true, script: "curl -sw '%{response_code}' -o /dev/null -u 'tasks:redhat1' -X DELETE http://tasks.${prefix}-tasks-dev.svc.cluster.local:8080/ws/tasks/1").trim()
                    if (status != "204") {
                        error 'Integration Create Test Failed!'
                    }
                }
            }
        }

        // Copy Image to Nexus Docker Registry
        stage('Copy Image to Nexus Docker Registry') {
            steps {
                echo "Copy image to Nexus Docker Registry"
                script {
                    sh "skopeo copy --src-tls-verify=false --dest-tls-verify=false --src-creds openshift:\$(oc whoami -t) --dest-creds admin:admin123 docker://docker-registry.default.svc.cluster.local:5000/${devProject}/tasks:${devTag} docker://nexus3-registry.${prefix}-nexus.svc.cluster.local:5000/tasks:${devTag}"

                    // Tag the built image with the production tag.
                    openshift.withCluster() {
                        openshift.withProject("${prodProject}") {
                            openshift.tag("${devProject}/tasks:${devTag}", "${devProject}/tasks:${prodTag}")
                        }
                    }
                }
            }
        }

        // Blue/Green Deployment into Production
        // -------------------------------------
        // Do not activate the new version yet.
        stage('Blue/Green Production Deployment') {
            steps {
                echo "Blue/Green Deployment"
                script {
                    openshift.withCluster() {
                        openshift.withProject("${prodProject}") {
                            activeApp = openshift.selector("route", "tasks").object().spec.to.name
                            if (activeApp == "tasks-green") {
                                destApp = "tasks-blue"
                            }
                            echo "Active Application:      " + activeApp
                            echo "Destination Application: " + destApp

                            // Update the Image on the Production Deployment Config
                            def dc = openshift.selector("dc/${destApp}").object()
                            dc.spec.template.spec.containers[0].image = "docker-registry.default.svc:5000/${devProject}/tasks:${prodTag}"
                            openshift.apply(dc)

                            // Update Config Map in change config files changed in the source
                            openshift.selector("configmap", "${destApp}-config").delete()
                            def configmap = openshift.create("configmap", "${destApp}-config", "--from-file=./configuration/application-users.properties", "--from-file=./configuration/application-roles.properties")

                            // Deploy the inactive application.
                            openshift.selector("dc", "${destApp}").rollout().latest();

                            // Wait for application to be deployed
                            def dc_prod = openshift.selector("dc", "${destApp}").object()
                            def dc_version = dc_prod.status.latestVersion
                            def rc_prod = openshift.selector("rc", "${destApp}-${dc_version}").object()
                            echo "Waiting for ${destApp} to be ready"
                            while (rc_prod.spec.replicas != rc_prod.status.readyReplicas) {
                                sleep 5
                                rc_prod = openshift.selector("rc", "${destApp}-${dc_version}").object()
                            }
                        }
                    }
                }
            }
        }

        stage('Switch over to new Version') {
            steps {
                input "Switch Production?"

                echo "Switching Production application to ${destApp}."
                script {
                    openshift.withCluster() {
                        openshift.withProject("${prodProject}") {
                            def route = openshift.selector("route/tasks").object()
                            route.spec.to.name = "${destApp}"
                            openshift.apply(route)
                        }
                    }
                }
            }
        }
    }
}
```
