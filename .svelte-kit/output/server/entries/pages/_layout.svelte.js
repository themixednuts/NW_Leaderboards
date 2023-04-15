import { c as create_ssr_component, b as subscribe, d as add_attribute, e as escape, f as each } from "../../chunks/index.js";
import { p as page } from "../../chunks/stores.js";
import { b as base } from "../../chunks/paths.js";
import { l as leaderboardMap } from "../../chunks/leaderboardmap.js";
const app = "";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".min-h-56.svelte-cnk0g2{min-height:14rem}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let firstLevelCategory;
  let category;
  let subcategory;
  let leaderboardId;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const leaderboardData = leaderboardMap;
  const bannerMap = {
    "Mutated Expeditions": "/lyshineui/images/leaderboards/leaderboard_cat_bg_expeditions.png",
    "Faction War": "/lyshineui/images/leaderboards/leaderboard_cat_bg_faction_convenant.png",
    "Vs. Environment": "/lyshineui/images/leaderboards/leaderboard_cat_bg_environment.png",
    "Vs. Players": "/lyshineui/images/leaderboards/leaderboard_cat_bg_player.png",
    "Trade Skills": "/lyshineui/images/leaderboards/leaderboard_cat_bg_trade.png"
  };
  $$result.css.add(css);
  firstLevelCategory = $page.url.searchParams.get("firstlevelcategory");
  category = $page.url.searchParams.get("category");
  subcategory = $page.url.searchParams.get("subcategory");
  $page.url.searchParams.get("regions");
  leaderboardId = $page.url.searchParams.get("leaderboardid");
  $$unsubscribe_page();
  return `<div class="container flex flex-col mx-auto gap-4 h-screen overflow-hidden"><div class="navbar bg-base-100 sticky top-0 z-50"><a href="./leaderboards" class="btn btn-ghost normal-case text-xl">New World Leaderboards
        </a></div>

    <div class="flex flex-col grow gap-2 bg-base-300 min-w-fit px-4 h-full overflow-y-auto rounded-box no-scrollbar"><div class="flex justify-center w-full place-self-stretch h-56 min-h-56 mt-4 border-2 p-2 border-base-100 rounded-box svelte-cnk0g2"><img${add_attribute("src", `${base}${bannerMap[firstLevelCategory || "mutated"]}`, 0)} alt="" class="object-cover border-2 border-base-100 min-h-full rounded-box"></div>
        <div class="flex place-content-center gap-4 place-items-center mt-4 sticky top-0 z-50 bg-base-300 py-2"><div class="dropdown">
                
                <label tabindex="0" class="btn m-1">${escape(firstLevelCategory ? firstLevelCategory : "Main Section")}</label>
                
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">${each(Object.keys(leaderboardData), (categoryKeys) => {
    return `<li><div${add_attribute("class", firstLevelCategory === categoryKeys ? "active" : "", 0)}>${escape(categoryKeys)}</div>
                        </li>`;
  })}</ul></div>
            ${firstLevelCategory ? `<div class="dropdown">
                    
                    <label tabindex="0" class="btn m-1">${escape(category ? category : "Category")}</label>
                    
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 left-1/2 -translate-x-1/2">${each(Object.keys(leaderboardData[firstLevelCategory]), (categoryKeys) => {
    return `<li><div${add_attribute("class", category === categoryKeys ? "active" : "", 0)}>${escape(categoryKeys)}</div>
                            </li>`;
  })}</ul></div>` : ``}

            ${firstLevelCategory && category ? `<div class="dropdown dropdown-end">
                    
                    <label tabindex="0" class="btn">${escape(subcategory ? subcategory : "Sub Category")}</label>
                    
                    <ul tabindex="0" class="${"dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 " + escape(
    subcategory ? "left-1/2 -translate-x-1/2" : "dropdown-end",
    true
  )}">${each(Object.keys(leaderboardData[firstLevelCategory][category]), (categoryKeys) => {
    return `<li><div${add_attribute("class", subcategory === categoryKeys ? "active" : "", 0)}>${escape(categoryKeys)}</div>
                            </li>`;
  })}</ul></div>` : ``}
            ${firstLevelCategory && category && subcategory ? `<div class="dropdown dropdown-end">
                    
                    <label tabindex="0" class="btn m-1">${escape(leaderboardId ? leaderboardData[firstLevelCategory][category][subcategory].find((item) => {
    return item.LeaderboardDefinitionId === leaderboardId;
  })?.DisplayName : "Leaderboards")}</label>
                    
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 dropdown-end">${each(Object.values(leaderboardData[firstLevelCategory][category][subcategory]), (categoryKeys) => {
    return `<li><div${add_attribute(
      "class",
      leaderboardId === categoryKeys.LeaderboardDefinitionId ? "active" : "",
      0
    )}>${escape(categoryKeys.DisplayName)}</div>
                            </li>`;
  })}</ul></div>` : ``}</div>
        ${firstLevelCategory && category && subcategory && leaderboardId ? `<div class="border-2 border-base-100 rounded-box p-2 my-2 sticky top-52 min-h-fit">${slots.default ? slots.default({}) : ``}</div>` : ``}</div>
    <div class="footer">Footer</div>
</div>`;
});
export {
  Layout as default
};
