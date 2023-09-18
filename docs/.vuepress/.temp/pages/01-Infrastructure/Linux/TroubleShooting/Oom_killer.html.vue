<template><div><h1 id="oom-killer가-일하는-방식" tabindex="-1"><a class="header-anchor" href="#oom-killer가-일하는-방식" aria-hidden="true">#</a> OOM Killer가 일하는 방식</h1>
<h2 id="oom-killer의-주요-업무는-다음-두-가지입니다" tabindex="-1"><a class="header-anchor" href="#oom-killer의-주요-업무는-다음-두-가지입니다" aria-hidden="true">#</a> OOM Killer의 주요 업무는 다음 두 가지입니다.</h2>
<ul>
<li>실행 중인 모든 프로세스를 살펴보며 각 프로세스의 메모리 사용량에 따라 OOM 점수를 산출합니다.</li>
<li>OS에서 메모리가 더 필요하면 점수가 가장 높은 프로세스를 종료시킵니다.</li>
</ul>
<h2 id="각-프로세스의-oom-score-관련-정보는-proc-pid-디렉토리-하위에서-찾을-수-있습니다" tabindex="-1"><a class="header-anchor" href="#각-프로세스의-oom-score-관련-정보는-proc-pid-디렉토리-하위에서-찾을-수-있습니다" aria-hidden="true">#</a> 각 프로세스의 oom_score 관련 정보는 /proc/(pid) 디렉토리 하위에서 찾을 수 있습니다.</h2>
<ul>
<li>oom_adj (oom_adjust)</li>
<li>oom_score_adj</li>
<li>oom_score</li>
</ul>
<h2 id="oom-killer는-점수를-나타내는-oom-score만-있으면-임무를-완수할-수-있습니다-그렇다면-oom-adj와-oom-score-adj의-역할은-무엇일까요-man-proc을-이용해-확인해-보겠습니다" tabindex="-1"><a class="header-anchor" href="#oom-killer는-점수를-나타내는-oom-score만-있으면-임무를-완수할-수-있습니다-그렇다면-oom-adj와-oom-score-adj의-역할은-무엇일까요-man-proc을-이용해-확인해-보겠습니다" aria-hidden="true">#</a> oom_killer는 점수를 나타내는 oom_score만 있으면 임무를 완수할 수 있습니다. 그렇다면 oom_adj와 oom_score_adj의 역할은 무엇일까요? man proc을 이용해 확인해 보겠습니다.</h2>
<ul>
<li>/proc/(pid)/oom_adj (Linux 2.6.11 이후): 점수를 조정하는 데 사용합니다. 일반적으로 -16에서 +15 사이의 값을 갖고, 특수 값 -17이 적용된 프로세스는 OOM killer 대상에서 제외됩니다. Linux 2.6.36 이후엔 /proc/(pid)/oom_score_adj로 대체됐고 더 이상 이 파일을 사용하지 않습니다.</li>
<li>/proc/(pid)/oom_score (Linux 2.6.11 이후): 현재 프로세스의 OOM 점수를 나타냅니다. 점수가 높을수록 OOM Killer의 대상이 될 확률이 높아집니다.</li>
<li>/proc/(pid)/oom_score_adj (Linux 2.6.36 이후): OOM 상황에서 어떤 프로세스를 종료할지 선택하는 기준이 되는 ‘badness 값’을 조정하는 데 사용합니다. -1000(oom_score_adj_MIN)에서 +1000(oom_score_adj_MAX) 사이의 값을 갖습니다. 이전 커널과의 하위 호환성을 위해 /proc/(pid)/oom_adj으로도 점수를 조정할 수 있으며 이때는 oom_score_adj에 비례해 값이 정해집니다. /proc/(pid)/oom_score_adj나 /proc/(pid)/oom_adj 중 하나의 값을 변경하면 다른 하나의 값도 비례하여 변경됩니다.</li>
</ul>
<h2 id="위의-설명에-따르면-oom-killer가-유일하게-의존하는-변수는-oom-score이고-oom-adj-또는-oom-score-adj을-이용해-그-값을-조정할-수-있습니다-현재-사용하고-있는-커널-버전은-kernel-3-10-0-957-el7입니다-리눅스-저장소에서-버전에-맞는-커널-소스-코드를-찾았습니다" tabindex="-1"><a class="header-anchor" href="#위의-설명에-따르면-oom-killer가-유일하게-의존하는-변수는-oom-score이고-oom-adj-또는-oom-score-adj을-이용해-그-값을-조정할-수-있습니다-현재-사용하고-있는-커널-버전은-kernel-3-10-0-957-el7입니다-리눅스-저장소에서-버전에-맞는-커널-소스-코드를-찾았습니다" aria-hidden="true">#</a> 위의 설명에 따르면 OOM Killer가 유일하게 의존하는 변수는 oom_score이고, oom_adj 또는 oom_score_adj을 이용해 그 값을 조정할 수 있습니다. 현재 사용하고 있는 커널 버전은 kernel-3.10.0-957.el7입니다. 리눅스 저장소에서 버전에 맞는 커널 소스 코드를 찾았습니다.</h2>
<ul>
<li>참조 링크: <a href="https://engineering.linecorp.com/ko/blog/prometheus-container-kubernetes-cluster/" target="_blank" rel="noopener noreferrer">https://engineering.linecorp.com/ko/blog/prometheus-container-kubernetes-cluster/<ExternalLinkIcon/></a></li>
</ul>
</div></template>


