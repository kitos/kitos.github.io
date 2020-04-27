[@bs.module "gatsby-image"] [@react.component]
external make:
  (~fixed: string=?, ~fluid: string=?, ~style: ReactDOMRe.Style.t=?) =>
  React.element =
  "default";
