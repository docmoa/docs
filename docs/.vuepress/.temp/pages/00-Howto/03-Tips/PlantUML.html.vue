<template><div><h1 id="uml" tabindex="-1"><a class="header-anchor" href="#uml" aria-hidden="true">#</a> UML</h1>
<p><a href="https://github.com/gmunguia/markdown-it-plantuml#readme" target="_blank" rel="noopener noreferrer">markdown-it-plantuml<ExternalLinkIcon/></a> 플러그인을 활성화 하여 UML 작성이 가능합니다. 아래는 플러그인 개발자의 안내를 풀어 일부 설명합니다.</p>
<h2 id="기본-사용법" tabindex="-1"><a class="header-anchor" href="#기본-사용법" aria-hidden="true">#</a> 기본 사용법</h2>
<p>UML 블록은 <code v-pre>@startuml</code> 과 <code v-pre>@enduml</code> 사이에 UML 구성을 위한 구성을 넣어 표기합니다. 아래와 같이 md 파일 내에 작성하면</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code>@startuml
Bob -> Alice : hello
@enduml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>다음과 같이 표기됩니다.</p>
<p>@startuml<br>
Bob -&gt; Alice : hello<br>
@enduml</p>
<p>다양한 예제는 <a href="http://plantuml.com/" target="_blank" rel="noopener noreferrer">plantuml.com<ExternalLinkIcon/></a>에서 확인할 수 있습니다.</p>
<h2 id="plantuml-예제" tabindex="-1"><a class="header-anchor" href="#plantuml-예제" aria-hidden="true">#</a> PlantUml 예제</h2>
<h3 id="sample-terraform-action" tabindex="-1"><a class="header-anchor" href="#sample-terraform-action" aria-hidden="true">#</a> Sample Terraform Action</h3>
<div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre class="language-ini"><code>@startuml
actor User
interface Terraform
cloud CLOUD

User ->> Terraform : Apply
User &lt;&lt;- Terraform : State
Terraform ->> CLOUD : Probisioning
CLOUD ->> Terraform : Response
@enduml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@startuml<br>
actor User<br>
interface Terraform<br>
cloud CLOUD</p>
<p>User -&gt;&gt; Terraform : Apply<br>
User &lt;&lt;- Terraform : State<br>
Terraform -&gt;&gt; CLOUD : Probisioning<br>
CLOUD -&gt;&gt; Terraform : Response<br>
@enduml</p>
<h3 id="sequence-diagram" tabindex="-1"><a class="header-anchor" href="#sequence-diagram" aria-hidden="true">#</a> Sequence Diagram</h3>
<p><a href="http://plantuml.com/sequence-diagram" target="_blank" rel="noopener noreferrer">http://plantuml.com/sequence-diagram<ExternalLinkIcon/></a></p>
<div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre class="language-ini"><code>@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice &lt;-- Bob: another authentication Response
@enduml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@startuml<br>
Alice -&gt; Bob: Authentication Request<br>
Bob --&gt; Alice: Authentication Response</p>
<p>Alice -&gt; Bob: Another authentication Request<br>
Alice &lt;-- Bob: another authentication Response<br>
@enduml</p>
<h3 id="usecase-diagram" tabindex="-1"><a class="header-anchor" href="#usecase-diagram" aria-hidden="true">#</a> UseCase Diagram</h3>
<p><a href="http://plantuml.com/use-case-diagram" target="_blank" rel="noopener noreferrer">http://plantuml.com/use-case-diagram<ExternalLinkIcon/></a></p>
<div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre class="language-ini"><code>@startuml
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@startuml<br>
:Main Admin: as Admin<br>
(Use the application) as (Use)</p>
<p>User -&gt; (Start)<br>
User --&gt; (Use)</p>
<p>Admin ---&gt; (Use)</p>
<p>note right of Admin : This is an example.</p>
<p>note right of (Use)<br>
A note can also<br>
be on several lines<br>
end note</p>
<p>note &quot;This note is connected\nto several objects.&quot; as N2<br>
(Start) .. N2<br>
N2 .. (Use)<br>
@enduml</p>
<h3 id="class-diagram" tabindex="-1"><a class="header-anchor" href="#class-diagram" aria-hidden="true">#</a> Class Diagram</h3>
<p><a href="http://plantuml.com/class-diagram" target="_blank" rel="noopener noreferrer">http://plantuml.com/class-diagram<ExternalLinkIcon/></a></p>
<div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre class="language-ini"><code>@startuml
Object &lt;|-- Dummy

class Dummy {
  String data
  void methods()
  -field1
  <span class="token comment">#field2</span>
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
Car -- Person : &lt; owns
@enduml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@startuml<br>
Object &lt;|-- Dummy</p>
<p>class Dummy {<br>
String data<br>
void methods()<br>
-field1<br>
#field2<br>
~method1()<br>
+method2()<br>
}</p>
<p>class Flight {<br>
flightNumber : Integer<br>
departureTime : Date<br>
}</p>
<p>class Car</p>
<p>Driver - Car : drives &gt;<br>
Car *- Wheel : have 4 &gt;<br>
Car -- Person : &lt; owns<br>
@enduml</p>
<h3 id="activity-diagram" tabindex="-1"><a class="header-anchor" href="#activity-diagram" aria-hidden="true">#</a> Activity Diagram</h3>
<p><a href="http://plantuml.com/activity-diagram-beta" target="_blank" rel="noopener noreferrer">http://plantuml.com/activity-diagram-beta<ExternalLinkIcon/></a></p>
<div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre class="language-ini"><code>@startuml
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@startuml<br>
start<br>
partition Initialization {<br>
:read config file;<br>
:init internal variable;<br>
}<br>
partition Running {<br>
if (multiprocessor?) then (yes)<br>
fork<br>
:Treatment 1;<br>
fork again<br>
:Treatment 2;<br>
detach<br>
end fork<br>
else (monoproc)<br>
:Treatment 1;<br>
:Treatment 2;<br>
endif<br>
}</p>
<p>stop<br>
@enduml</p>
<h3 id="component-diagram" tabindex="-1"><a class="header-anchor" href="#component-diagram" aria-hidden="true">#</a> Component Diagram</h3>
<p><a href="http://plantuml.com/component-diagram" target="_blank" rel="noopener noreferrer">http://plantuml.com/component-diagram<ExternalLinkIcon/></a></p>
<div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre class="language-ini"><code>@startuml
package "Some Group" {
  HTTP - [First Component]
  <span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Another Component</span><span class="token punctuation">]</span></span>
}

node "Other Groups" {
  FTP - [Second Component]
  <span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">First Component</span><span class="token punctuation">]</span></span> --> FTP
}

cloud {
  <span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Example 1</span><span class="token punctuation">]</span></span>
}


database "MySql" {
  folder "This is my folder" {
    <span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Folder 3</span><span class="token punctuation">]</span></span>
  }
  frame "Foo" {
    <span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Frame 4</span><span class="token punctuation">]</span></span>
  }
}


<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Another Component</span><span class="token punctuation">]</span></span> --> [Example 1]
<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Example 1</span><span class="token punctuation">]</span></span> --> [Folder 3]
<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Folder 3</span><span class="token punctuation">]</span></span> --> [Frame 4]
@enduml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@startuml<br>
package &quot;Some Group&quot; {<br>
HTTP - [First Component]<br>
[Another Component]<br>
}</p>
<p>node &quot;Other Groups&quot; {<br>
FTP - [Second Component]<br>
[First Component] --&gt; FTP<br>
}</p>
<p>cloud {<br>
[Example 1]<br>
}</p>
<p>database &quot;MySql&quot; {<br>
folder &quot;This is my folder&quot; {<br>
[Folder 3]<br>
}<br>
frame &quot;Foo&quot; {<br>
[Frame 4]<br>
}<br>
}</p>
<p>[Another Component] --&gt; [Example 1]<br>
[Example 1] --&gt; [Folder 3]<br>
[Folder 3] --&gt; [Frame 4]<br>
@enduml</p>
<h3 id="state-diagram" tabindex="-1"><a class="header-anchor" href="#state-diagram" aria-hidden="true">#</a> State Diagram</h3>
<p><a href="http://plantuml.com/state-diagram" target="_blank" rel="noopener noreferrer">http://plantuml.com/state-diagram<ExternalLinkIcon/></a></p>
<div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre class="language-ini"><code>@startuml
<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">*</span><span class="token punctuation">]</span></span> --> State1
State1 --> [*]
State1 : this is a string
State1 : this is another string

State1 -> State2
State2 --> [*]

scale 350 width
<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">*</span><span class="token punctuation">]</span></span> --> NotShooting

state NotShooting {
  <span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">*</span><span class="token punctuation">]</span></span> --> Idle
  Idle --> Configuring : EvConfig
  Configuring --> Idle : EvConfig
}

state Configuring {
  <span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">*</span><span class="token punctuation">]</span></span> --> NewValueSelection
  NewValueSelection --> NewValuePreview : EvNewValue
  NewValuePreview --> NewValueSelection : EvNewValueRejected
  NewValuePreview --> NewValueSelection : EvNewValueSaved

  state NewValuePreview {
     State1 -> State2
  }
}
@enduml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@startuml<br>
[<em>] --&gt; State1<br>
State1 --&gt; [</em>]<br>
State1 : this is a string<br>
State1 : this is another string</p>
<p>State1 -&gt; State2<br>
State2 --&gt; [*]</p>
<p>scale 350 width<br>
[*] --&gt; NotShooting</p>
<p>state NotShooting {<br>
[*] --&gt; Idle<br>
Idle --&gt; Configuring : EvConfig<br>
Configuring --&gt; Idle : EvConfig<br>
}</p>
<p>state Configuring {<br>
[*] --&gt; NewValueSelection<br>
NewValueSelection --&gt; NewValuePreview : EvNewValue<br>
NewValuePreview --&gt; NewValueSelection : EvNewValueRejected<br>
NewValuePreview --&gt; NewValueSelection : EvNewValueSaved</p>
<p>state NewValuePreview {<br>
State1 -&gt; State2<br>
}<br>
}<br>
@enduml</p>
<h3 id="network-diagram" tabindex="-1"><a class="header-anchor" href="#network-diagram" aria-hidden="true">#</a> Network Diagram</h3>
<p><a href="https://plantuml.com/nwdiag" target="_blank" rel="noopener noreferrer">https://plantuml.com/nwdiag<ExternalLinkIcon/></a></p>
<div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre class="language-ini"><code>@startuml
nwdiag {
  network dmz {
      <span class="token key attr-name">address</span> <span class="token punctuation">=</span> <span class="token value attr-value">"<span class="token inner-value">210.x.x.x/24</span>"</span>

      // set multiple addresses (using comma)
      <span class="token key attr-name">web01 [address</span> <span class="token punctuation">=</span> <span class="token value attr-value">"210.x.x.1, 210.x.x.20"];</span>
      <span class="token key attr-name">web02 [address</span> <span class="token punctuation">=</span> <span class="token value attr-value">"210.x.x.2"];</span>
  }
  network internal {
      <span class="token key attr-name">address</span> <span class="token punctuation">=</span> <span class="token value attr-value">"172.x.x.x/24";</span>

      <span class="token key attr-name">web01 [address</span> <span class="token punctuation">=</span> <span class="token value attr-value">"172.x.x.1"];</span>
      <span class="token key attr-name">web02 [address</span> <span class="token punctuation">=</span> <span class="token value attr-value">"172.x.x.2"];</span>
      db01;
      db02;
  }
}
@enduml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@startuml<br>
nwdiag {<br>
network dmz {<br>
address = &quot;210.x.x.x/24&quot;</p>
<pre><code>  // set multiple addresses (using comma)
  web01 [address = &quot;210.x.x.1, 210.x.x.20&quot;];
  web02 [address = &quot;210.x.x.2&quot;];
</code></pre>
<p>}<br>
network internal {<br>
address = &quot;172.x.x.x/24&quot;;</p>
<pre><code>  web01 [address = &quot;172.x.x.1&quot;];
  web02 [address = &quot;172.x.x.2&quot;];
  db01;
  db02;
</code></pre>
<p>}<br>
}<br>
@enduml</p>
<h3 id="gantt-diagram" tabindex="-1"><a class="header-anchor" href="#gantt-diagram" aria-hidden="true">#</a> Gantt Diagram</h3>
<p><a href="https://plantuml.com/gantt-diagram" target="_blank" rel="noopener noreferrer">https://plantuml.com/gantt-diagram<ExternalLinkIcon/></a></p>
<div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre class="language-ini"><code>@startuml
@startgantt
<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Prototype design</span><span class="token punctuation">]</span></span> lasts 15 days
<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Test prototype</span><span class="token punctuation">]</span></span> lasts 10 days
-- All example --
<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Task 1 (1 day)</span><span class="token punctuation">]</span></span> lasts 1 day
<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">T2 (5 days)</span><span class="token punctuation">]</span></span> lasts 5 days
<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">T3 (1 week)</span><span class="token punctuation">]</span></span> lasts 1 week
<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">T4 (1 week and 4 days)</span><span class="token punctuation">]</span></span> lasts 1 week and 4 days
<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">T5 (2 weeks)</span><span class="token punctuation">]</span></span> lasts 2 weeks
@endgantt
@enduml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@startuml<br>
@startgantt<br>
[Prototype design] lasts 15 days<br>
[Test prototype] lasts 10 days<br>
-- All example --<br>
[Task 1 (1 day)] lasts 1 day<br>
[T2 (5 days)] lasts 5 days<br>
[T3 (1 week)] lasts 1 week<br>
[T4 (1 week and 4 days)] lasts 1 week and 4 days<br>
[T5 (2 weeks)] lasts 2 weeks<br>
@endgantt<br>
@enduml</p>
<h3 id="mindmap" tabindex="-1"><a class="header-anchor" href="#mindmap" aria-hidden="true">#</a> MindMap</h3>
<p><a href="https://plantuml.com/mindmap-diagram" target="_blank" rel="noopener noreferrer">https://plantuml.com/mindmap-diagram<ExternalLinkIcon/></a></p>
<div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre class="language-ini"><code>@startuml
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
<span class="token key attr-name">*** &lt;s>Raspmbc&lt;/s></span> <span class="token punctuation">=</span><span class="token value attr-value">> OSMC</span>
<span class="token key attr-name">*** &lt;s>Raspyfi&lt;/s></span> <span class="token punctuation">=</span><span class="token value attr-value">> Volumio</span>
@endmindmap
@enduml

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>@startuml<br>
@startmindmap</p>
<ul>
<li>Debian<br>
** Ubuntu<br>
*** Linux Mint<br>
*** Kubuntu<br>
*** Lubuntu<br>
*** KDE Neon<br>
** LMDE<br>
** SolydXK<br>
** SteamOS<br>
** Raspbian with a very long name<br>
*** <s>Raspmbc</s> =&gt; OSMC<br>
*** <s>Raspyfi</s> =&gt; Volumio<br>
@endmindmap<br>
@enduml</li>
</ul>
</div></template>


