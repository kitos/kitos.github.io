open React;
open Belt_Array;

let toTree = headings =>
  reduce(headings, [], (tree, current) =>
    switch (tree) {
    | [] => [(current, [])]
    | [lastNode, ...rest] =>
      let (last, _) = lastNode;

      snd(last) == snd(current)
        ? [(current, []), lastNode, ...rest]
        : [(fst(lastNode), [(current, []), ...snd(lastNode)]), ...rest];
    }
  )
  |> Belt_List.reverse;

let linkStyle = ReactDOMRe.Style.make(~color="gray", ());

[@react.component]
let default = (~headings, ~className, ~slugify) => {
  <nav className>
    <ul
      style={ReactDOMRe.Style.make(
        ~fontSize="12px",
        ~listStyle="none",
        ~margin="0",
        ~borderLeft="1px solid #e1e4e7",
        ~paddingLeft="10px",
        (),
      )}>
      {keep(headings, h => h##depth == 2 || h##depth == 3)
       ->map(h => (h##value, h##depth))
       ->toTree
       ->Belt_List.toArray
       ->map((((value, _), children)) =>
           <li key=value>
             <a href={"#" ++ slugify(value)} style=linkStyle>
               {string(value)}
             </a>
             {switch (children) {
              | [] => string("")
              | subHeadings =>
                <ul
                  style={ReactDOMRe.Style.make(
                    ~listStyle="none",
                    ~marginLeft="20px",
                    (),
                  )}>
                  {Belt_List.toArray(subHeadings)
                   ->map((((v, _), _)) =>
                       <li key=v>
                         <a href={"#" ++ slugify(v)} style=linkStyle>
                           {string(v)}
                         </a>
                       </li>
                     )
                   ->array}
                </ul>
              }}
           </li>
         )
       ->array}
    </ul>
  </nav>;
};
