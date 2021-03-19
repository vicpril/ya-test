import { get } from "../utils/mydash/get";

export class Templator {
   TEMPLATE_REGEXP = /\{\{(.*?)\}\}/gi;

   constructor(template) {
      this._template = template;
   }

   compile(ctx) {
      return this._compileTemplate(ctx);
   }

   _compileTemplate(ctx) {
      let template = this._template;
      const regExp = this.TEMPLATE_REGEXP; // avoid from infinity loop
      let key = null;

      while ((key = regExp.exec(template))) {
         if (key[1]) {
            const templValue = key[1].trim();
            const data = get(ctx, templValue);

            // handle function
            if (typeof data === 'function') {
               window[templValue] = data;
               template = template.replace(
                  new RegExp(key[0], "gi"),
                  `window.${key[1].trim()}()`
               )
               continue;
            }

            template = template.replace(new RegExp(key[0], "gi"), data);
         }
      }

      return template;
   }
}