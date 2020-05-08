open React;
open ReactDOMRe;

type buildPostLinkArgs = {
  slug: string,
  lang: string,
};

[@bs.module "./utils.js"]
external buildPostLink: buildPostLinkArgs => string = "buildPostLink";

module BlogTags = {
  [@bs.module "./blog-tags.js"] [@react.component]
  external make: (~tags: array(string)) => React.element = "BlogTags";
};

module PostCard = {
  [@react.component]
  let make = (~post) => {
    let (isHover, setIsHover) = useState(() => false);

    <GatsbyLink
      _to={buildPostLink({slug: post##slug, lang: post##lang})}
      style={Style.make(~textDecoration="none", ())}>
      <Grid.flex flexDirection=[|"column", "row", "column"|]>
        <Grid.box flex=[|"1 0 50%"|]>
          <GatsbyImg
            fluid={post##img##fluid}
            style={Style.make(~maxWidth="400px", ())}
          />
        </Grid.box>
        <Grid.box
          flex=[|"1 0 50%"|]
          pt=[|"16px", "0", "16px"|]
          pl=[|"0", "16px", "0"|]>
          <div
            style={
              isHover
                ? Style.make(~textDecoration="underline", ()) : Style.make()
            }
            onMouseEnter={_ => setIsHover(_ => true)}
            onMouseLeave={_ => setIsHover(_ => false)}>
            {string(post##title)}
          </div>
          <span style={Style.make(~color="gray", ~fontSize="14px", ())}>
            {string(
               post##date
               |> Js_date.fromString
               |> DateFns.format("MMM dd, yyyy"),
             )}
            {string({j| · |j})}
            {string(post##timeToRead)}
            {string(" min read")}
          </span>
          <BlogTags tags=post##tags />
        </Grid.box>
      </Grid.flex>
    </GatsbyLink>;
  };
};

[@react.component]
let default = (~posts) =>
  <Grid.flex
    justifyContent=[|"center"|] py=[|"30px"|] px=[|"0", "0", "0", "30px"|]>
    <section style={Style.make(~flex="1 1 auto", ())}>
      <h2 style={Style.make(~borderBottom="none", ~margin="0 0 16px 0", ())}>
        {string("Related reads")}
      </h2>
      <Grid.flex
        _as="ul"
        flexDirection=[|"column", "column", "row"|]
        alignItems=[|"stretch", "stretch", "flex-start"|]
        mx=[|"0", "0", "-16px"|]
        my=[|"-16px", "-16px", "0"|]
        style={Style.make(
          ~justifyContent="space-between",
          ~listStyle="none",
          (),
        )}>
        {Belt_Array.map(posts, post =>
           <Grid.box
             _as="li"
             key={post##slug}
             mx=[|"0", "0", "16px"|]
             my=[|"16px", "16px", "0"|]
             flex=[|"1 1 33%"|]
             style={Style.make(~minWidth="200px", ())}>
             <PostCard post />
           </Grid.box>
         )
         |> array}
      </Grid.flex>
    </section>
  </Grid.flex>;
