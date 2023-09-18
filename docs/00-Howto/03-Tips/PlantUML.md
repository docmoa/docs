---


---

# UML

[markdown-it-plantuml](https://github.com/gmunguia/markdown-it-plantuml#readme) 플러그인을 활성화 하여 UML 작성이 가능합니다. 아래는 플러그인 개발자의 안내를 풀어 일부 설명합니다.

## 기본 사용법
UML 블록은 `@startuml` 과 `@enduml` 사이에 UML 구성을 위한 구성을 넣어 표기합니다. 아래와 같이 md 파일 내에 작성하면

```md
@startuml
Bob -> Alice : hello
@enduml
```

다음과 같이 표기됩니다.

@startuml
Bob -> Alice : hello
@enduml

다양한 예제는 [plantuml.com](http://plantuml.com/)에서 확인할 수 있습니다.

## PlantUml 예제

### Sample Terraform Action

```ini
@startuml
actor User
interface Terraform
cloud CLOUD

User ->> Terraform : Apply
User <<- Terraform : State
Terraform ->> CLOUD : Probisioning
CLOUD ->> Terraform : Response
@enduml
```

@startuml
actor User
interface Terraform
cloud CLOUD

User ->> Terraform : Apply
User <<- Terraform : State
Terraform ->> CLOUD : Probisioning
CLOUD ->> Terraform : Response
@enduml

### Sequence Diagram

http://plantuml.com/sequence-diagram

```ini
@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: another authentication Response
@enduml
```

@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: another authentication Response
@enduml

### UseCase Diagram

http://plantuml.com/use-case-diagram

```ini
@startuml
:Main Admin: as Admin
(Use the application) as (Use)

User -> (Start)
User --> (Use)

Admin ---> (Use)

note right of Admin : This is an example.

note right of (Use)
  A note can also
  be on several lines
end note

note "This note is connected\nto several objects." as N2
(Start) .. N2
N2 .. (Use)
@enduml
```

@startuml
:Main Admin: as Admin
(Use the application) as (Use)

User -> (Start)
User --> (Use)

Admin ---> (Use)

note right of Admin : This is an example.

note right of (Use)
  A note can also
  be on several lines
end note

note "This note is connected\nto several objects." as N2
(Start) .. N2
N2 .. (Use)
@enduml

### Class Diagram

http://plantuml.com/class-diagram

```ini
@startuml
Object <|-- Dummy

class Dummy {
  String data
  void methods()
  -field1
  #field2
  ~method1()
  +method2()
}

class Flight {
   flightNumber : Integer
   departureTime : Date
}

class Car

Driver - Car : drives >
Car *- Wheel : have 4 >
Car -- Person : < owns
@enduml
```

@startuml
Object <|-- Dummy

class Dummy {
  String data
  void methods()
  -field1
  #field2
  ~method1()
  +method2()
}

class Flight {
   flightNumber : Integer
   departureTime : Date
}

class Car

Driver - Car : drives >
Car *- Wheel : have 4 >
Car -- Person : < owns
@enduml

### Activity Diagram

http://plantuml.com/activity-diagram-beta

```ini
@startuml
start
partition Initialization {
    :read config file;
    :init internal variable;
}
partition Running {
    if (multiprocessor?) then (yes)
    fork
        :Treatment 1;
    fork again
        :Treatment 2;
        detach
    end fork
    else (monoproc)
    :Treatment 1;
    :Treatment 2;
    endif
}

stop
@enduml
```

@startuml
start
partition Initialization {
    :read config file;
    :init internal variable;
}
partition Running {
    if (multiprocessor?) then (yes)
    fork
        :Treatment 1;
    fork again
        :Treatment 2;
        detach
    end fork
    else (monoproc)
    :Treatment 1;
    :Treatment 2;
    endif
}

stop
@enduml

### Component Diagram

http://plantuml.com/component-diagram

```ini
@startuml
package "Some Group" {
  HTTP - [First Component]
  [Another Component]
}

node "Other Groups" {
  FTP - [Second Component]
  [First Component] --> FTP
}

cloud {
  [Example 1]
}


database "MySql" {
  folder "This is my folder" {
    [Folder 3]
  }
  frame "Foo" {
    [Frame 4]
  }
}


[Another Component] --> [Example 1]
[Example 1] --> [Folder 3]
[Folder 3] --> [Frame 4]
@enduml
```

@startuml
package "Some Group" {
  HTTP - [First Component]
  [Another Component]
}

node "Other Groups" {
  FTP - [Second Component]
  [First Component] --> FTP
}

cloud {
  [Example 1]
}


database "MySql" {
  folder "This is my folder" {
    [Folder 3]
  }
  frame "Foo" {
    [Frame 4]
  }
}


[Another Component] --> [Example 1]
[Example 1] --> [Folder 3]
[Folder 3] --> [Frame 4]
@enduml

### State Diagram

http://plantuml.com/state-diagram

```ini
@startuml
[*] --> State1
State1 --> [*]
State1 : this is a string
State1 : this is another string

State1 -> State2
State2 --> [*]

scale 350 width
[*] --> NotShooting

state NotShooting {
  [*] --> Idle
  Idle --> Configuring : EvConfig
  Configuring --> Idle : EvConfig
}

state Configuring {
  [*] --> NewValueSelection
  NewValueSelection --> NewValuePreview : EvNewValue
  NewValuePreview --> NewValueSelection : EvNewValueRejected
  NewValuePreview --> NewValueSelection : EvNewValueSaved

  state NewValuePreview {
     State1 -> State2
  }
}
@enduml
```

@startuml
[*] --> State1
State1 --> [*]
State1 : this is a string
State1 : this is another string

State1 -> State2
State2 --> [*]

scale 350 width
[*] --> NotShooting

state NotShooting {
  [*] --> Idle
  Idle --> Configuring : EvConfig
  Configuring --> Idle : EvConfig
}

state Configuring {
  [*] --> NewValueSelection
  NewValueSelection --> NewValuePreview : EvNewValue
  NewValuePreview --> NewValueSelection : EvNewValueRejected
  NewValuePreview --> NewValueSelection : EvNewValueSaved

  state NewValuePreview {
     State1 -> State2
  }
}
@enduml

### Network Diagram

https://plantuml.com/nwdiag

```ini
@startuml
nwdiag {
  network dmz {
      address = "210.x.x.x/24"

      // set multiple addresses (using comma)
      web01 [address = "210.x.x.1, 210.x.x.20"];
      web02 [address = "210.x.x.2"];
  }
  network internal {
      address = "172.x.x.x/24";

      web01 [address = "172.x.x.1"];
      web02 [address = "172.x.x.2"];
      db01;
      db02;
  }
}
@enduml
```

@startuml
nwdiag {
  network dmz {
      address = "210.x.x.x/24"

      // set multiple addresses (using comma)
      web01 [address = "210.x.x.1, 210.x.x.20"];
      web02 [address = "210.x.x.2"];
  }
  network internal {
      address = "172.x.x.x/24";

      web01 [address = "172.x.x.1"];
      web02 [address = "172.x.x.2"];
      db01;
      db02;
  }
}
@enduml

### Gantt Diagram

https://plantuml.com/gantt-diagram

```ini
@startuml
@startgantt
[Prototype design] lasts 15 days
[Test prototype] lasts 10 days
-- All example --
[Task 1 (1 day)] lasts 1 day
[T2 (5 days)] lasts 5 days
[T3 (1 week)] lasts 1 week
[T4 (1 week and 4 days)] lasts 1 week and 4 days
[T5 (2 weeks)] lasts 2 weeks
@endgantt
@enduml
```

@startuml
@startgantt
[Prototype design] lasts 15 days
[Test prototype] lasts 10 days
-- All example --
[Task 1 (1 day)] lasts 1 day
[T2 (5 days)] lasts 5 days
[T3 (1 week)] lasts 1 week
[T4 (1 week and 4 days)] lasts 1 week and 4 days
[T5 (2 weeks)] lasts 2 weeks
@endgantt
@enduml

### MindMap

https://plantuml.com/mindmap-diagram

```ini
@startuml
@startmindmap
* Debian
** Ubuntu
*** Linux Mint
*** Kubuntu
*** Lubuntu
*** KDE Neon
** LMDE
** SolydXK
** SteamOS
** Raspbian with a very long name
*** <s>Raspmbc</s> => OSMC
*** <s>Raspyfi</s> => Volumio
@endmindmap
@enduml

```

@startuml
@startmindmap
* Debian
** Ubuntu
*** Linux Mint
*** Kubuntu
*** Lubuntu
*** KDE Neon
** LMDE
** SolydXK
** SteamOS
** Raspbian with a very long name
*** <s>Raspmbc</s> => OSMC
*** <s>Raspyfi</s> => Volumio
@endmindmap
@enduml
