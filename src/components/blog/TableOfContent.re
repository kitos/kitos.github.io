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
        : [
          (
            fst(lastNode),
            Belt_List.concat(snd(lastNode), [(current, [])]),
          ),
          ...rest,
        ];
    }
  )
  |> Belt_List.reverse;

let linkStyle = ReactDOMRe.Style.make(~color="gray", ());

module Link = {
  [@react.component]
  let make = (~value, ~slugify, ~active) => {
    let id = slugify(value);
    let isActive = active == id;

    <a
      href={"#" ++ id}
      style={ReactDOMRe.Style.make(
        ~color=isActive ? "hsla(0,0%,0%,0.8)" : "gray",
        ~position="relative",
        (),
      )}>
      <span
        style={ReactDOMRe.Style.make(
          ~position="absolute",
          ~top="-5px",
          ~right="100%",
          ~fontSize="16px",
          (),
        )}>
        {string(isActive ? {js|👉 |js} : "")}
      </span>
      {string(value)}
    </a>;
  };
};

[@react.component]
let default = (~headings, ~active, ~className, ~slugify) => {
  <nav className>
    <ul
      style={ReactDOMRe.Style.make(
        ~fontSize="12px",
        ~listStyle="none",
        ~margin="0",
        ~borderLeft="1px solid #e1e4e7",
        ~paddingLeft="25px",
        (),
      )}>
      {keep(headings, h => h##depth == 2 || h##depth == 3)
       ->map(h => (h##value, h##depth))
       ->toTree
       ->Belt_List.toArray
       ->map((((value, _), children)) =>
           <li key=value>
             <Link value slugify active />
             {switch (children) {
              | [] => string("")
              | subHeadings =>
                <ul
                  style={ReactDOMRe.Style.make(
                    ~listStyle="none",
                    ~marginLeft="0",
                    ~paddingLeft="10px",
                    (),
                  )}>
                  {Belt_List.toArray(subHeadings)
                   ->map((((value, _), _)) =>
                       <li key=value> <Link value slugify active /> </li>
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
