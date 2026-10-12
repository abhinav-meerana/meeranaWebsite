# Templates

## Section spec

```
### H<n>. <Section name>                       anchor: #<id>
Purpose:            <why this section exists, one sentence>
Visitor question:   "<the question it answers>"
Headline:           <proposed headline>       [evidence: EV-…]
Body:               <≤ 60 words>              [evidence: EV-…]
Evidence shown:     <facts, artefacts, proof items, with EV ids>
Composition:        <layout on desktop; what is DOM vs canvas>
Interaction:        <what the user can do; what animates; link to motion spec id M-…>
CTA → destination:  <label> → <route/anchor>
Assets:             <list; status: have / need / placeholder>
Desktop:            <behaviour>
Mobile:             <behaviour>
No-motion state:    <what renders with animation off>
Open questions:     <decision-log ids>
```

## Product storyboard

```
## <Product> — storyboard                        route: /products/<slug>
Positioning (approved):  <one sentence>       [EV-…]
Primary user / buyer:    <user> / <buyer>
Environment:             <where it runs>
Brand language:          <palette tokens, display face, logo file>

Beat 1  Problem          visual: …  copy: …  evidence: …
Beat 2  User & place     visual: …  copy: …
Beat 3  Product intro    visual: …  copy: …
Beat 4  Interface        screen id: UI-<slug>-01 (real | reconstructed | illustrative)
Beat 5  Task walkthrough steps: 1 … 2 … 3 …   motion: M-<slug>-…
Beat 6  Feature moments  feature → moment in task → UI element
Beat 7  Output           what the user ends with (decision, record, report, open gate)
Beat 8  Value & CTA      verified value statements; proof; CTA label → route
Transitions in/out:      …
Missing assets & fallback: …
```
