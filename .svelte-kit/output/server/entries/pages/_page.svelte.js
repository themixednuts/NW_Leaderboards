import { c as create_ssr_component, b as subscribe, e as escape, f as each, i as is_promise, n as noop, v as validate_component } from "../../chunks/index.js";
import { p as page } from "../../chunks/stores.js";
import { l as leaderboardMap } from "../../chunks/leaderboardmap.js";
let itemsPerPage = 10;
function secondsToTimeFormat(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
const Table = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let firstlevelcategory;
  let category;
  let subcategory;
  let leaderboardid;
  let data;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { table } = $$props;
  const leaderboardData = leaderboardMap;
  const pageSize = Math.ceil(table.length / 10);
  const pageSizeArray = Array.from({ length: pageSize }, (_, i) => i + 1);
  let currentPage = 1;
  const pageArrayIndex = Array(itemsPerPage).fill(0);
  for (let i = 0; i < pageArrayIndex.length; i++) {
    pageArrayIndex[i] = i;
  }
  if ($$props.table === void 0 && $$bindings.table && table !== void 0)
    $$bindings.table(table);
  firstlevelcategory = $page.url.searchParams.get("firstlevelcategory");
  category = $page.url.searchParams.get("category");
  subcategory = $page.url.searchParams.get("subcategory");
  $page.url.searchParams.get("regions");
  leaderboardid = $page.url.searchParams.get("leaderboardid");
  data = leaderboardData[firstlevelcategory][category][subcategory].find((item) => item.LeaderboardDefinitionId === leaderboardid);
  $$unsubscribe_page();
  return `<div class="flex justify-center capitalize sticky top-16 z-50 bg-base-300 py-4 w-full">${escape(!isNaN(Number(data.DisplayName)) ? `${category}, ${data.DisplayName}` : data.DisplayName)}</div>
<table class="table table-zebra w-full table-compact md:table-normal table-fixed"><thead><tr><th>Rank</th>
            <th>${escape(data.Value)}</th>
            <th>Server</th></tr></thead>
    <tbody>${each(pageArrayIndex, (i) => {
    return `${table[i] ? `<tr><td>${escape(i + 1)}</td>
                    <td>${escape(data.Value === "Time" ? secondsToTimeFormat(table[i].value) : table[i].value)}</td>
                    <td>${escape(table[i].server)}</td>
                </tr>` : ``}`;
  })}</tbody></table>

<div class="flex justify-center btn-group place-self-center py-2 my-0">${pageSize > 5 ? `
        <button class="${"btn btn-sm " + escape(currentPage === pageSizeArray[0] ? "btn-active" : "", true)}">${escape(pageSizeArray[0])}</button>
        
        ${`${currentPage - 1 >= pageSize - 3 ? `<button class="${"btn btn-sm " + escape(currentPage === pageSize - 3 ? "btn-active" : "", true)}">${escape(pageSize - 3)}</button>` : `<button class="${"btn btn-sm " + escape(currentPage === pageSizeArray[1] ? "btn-active" : "", true)}">${escape(pageSizeArray[1])}</button>`}`}
        
        ${`${`<button class="${"btn btn-sm " + escape(currentPage === pageSizeArray[2] ? "btn-active" : "", true)}">${escape(pageSizeArray[2])}</button>`}`}
        
        ${currentPage + 1 < pageSize - 1 && currentPage + 1 > pageSizeArray[2] ? `<button class="${"btn btn-sm " + escape("", true)}">${escape(currentPage + 1)}</button>` : `${currentPage + 1 <= pageSizeArray[2] ? `<button class="${"btn btn-sm " + escape(currentPage === pageSizeArray[3] ? "btn-active" : "", true)}">${escape(pageSizeArray[3])}</button>` : `<button class="${"btn btn-sm " + escape(currentPage === pageSize - 1 ? "btn-active" : "", true)}">${escape(pageSize - 1)}</button>`}`}
        
        <button class="${"btn btn-sm " + escape(currentPage === pageSize ? "btn-active" : "", true)}">${escape(pageSize)}</button>` : `${each(pageSizeArray, (i) => {
    return `<button class="${"btn btn-sm " + escape(currentPage === i ? "btn-active" : "", true)}">${escape(i)}</button>`;
  })}`}</div>`;
});
async function getTableData(leaderboardId2) {
  const response = await fetch(`https://lb.jakel.rocks/json/${leaderboardId2}/s1?size=1000`);
  const data = await response.json();
  return data;
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let leaderboardId;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  leaderboardId = $page.url.searchParams.get("leaderboardid");
  $$unsubscribe_page();
  return `${leaderboardId ? `${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
        <div>loading...</div>
    `;
    }
    return function(tableData) {
      return `
        ${validate_component(Table, "Table").$$render($$result, { table: tableData.data }, {}, {})}
    `;
    }(__value);
  }(getTableData(leaderboardId))}` : ``}`;
});
export {
  Page as default
};
