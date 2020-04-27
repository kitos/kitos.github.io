[@bs.module "@rebass/grid"] [@react.component]
external flex:
  (
    ~_as: string=?,
    ~flexDirection: array(string)=?,
    ~justifyContent: array(string)=?,
    ~alignItems: array(string)=?,
    ~flexWrap: array(string)=?,
    ~p: array(string)=?,
    ~pt: array(string)=?,
    ~pr: array(string)=?,
    ~pb: array(string)=?,
    ~pl: array(string)=?,
    ~px: array(string)=?,
    ~py: array(string)=?,
    ~m: array(string)=?,
    ~mt: array(string)=?,
    ~mr: array(string)=?,
    ~mb: array(string)=?,
    ~mt: array(string)=?,
    ~mx: array(string)=?,
    ~my: array(string)=?,
    ~style: ReactDOMRe.Style.t=?,
    ~children: React.element
  ) =>
  React.element =
  "Flex";

[@bs.module "@rebass/grid"] [@react.component]
external box:
  (
    ~_as: string=?,
    ~p: array(string)=?,
    ~pt: array(string)=?,
    ~pr: array(string)=?,
    ~pb: array(string)=?,
    ~pl: array(string)=?,
    ~px: array(string)=?,
    ~py: array(string)=?,
    ~m: array(string)=?,
    ~mt: array(string)=?,
    ~mr: array(string)=?,
    ~mb: array(string)=?,
    ~mt: array(string)=?,
    ~mx: array(string)=?,
    ~my: array(string)=?,
    ~flex: array(string)=?,
    ~style: ReactDOMRe.Style.t=?,
    ~children: React.element
  ) =>
  React.element =
  "Box";
