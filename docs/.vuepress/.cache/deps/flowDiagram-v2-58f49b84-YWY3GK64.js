import {
  flowRendererV2,
  flowStyles
} from "./chunk-NB5MDRYD.js";
import "./chunk-W3ZBTTGH.js";
import {
  flowDb,
  parser$1
} from "./chunk-GNG6WWZB.js";
import "./chunk-YLQFPJKL.js";
import "./chunk-CQHM2HK6.js";
import "./chunk-T2JNBJQX.js";
import "./chunk-ODTBTE3U.js";
import "./chunk-I23LFEZH.js";
import {
  require_dayjs_min,
  require_dist,
  setConfig
} from "./chunk-ENWLQLJT.js";
import {
  __toESM
} from "./chunk-AUZ3RYOM.js";

// node_modules/mermaid/dist/flowDiagram-v2-58f49b84.js
var import_dayjs = __toESM(require_dayjs_min(), 1);
var import_sanitize_url = __toESM(require_dist(), 1);
var diagram = {
  parser: parser$1,
  db: flowDb,
  renderer: flowRendererV2,
  styles: flowStyles,
  init: (cnf) => {
    if (!cnf.flowchart) {
      cnf.flowchart = {};
    }
    cnf.flowchart.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
    setConfig({ flowchart: { arrowMarkerAbsolute: cnf.arrowMarkerAbsolute } });
    flowRendererV2.setConf(cnf.flowchart);
    flowDb.clear();
    flowDb.setGen("gen-2");
  }
};
export {
  diagram
};
//# sourceMappingURL=flowDiagram-v2-58f49b84-YWY3GK64.js.map
