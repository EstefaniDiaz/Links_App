
import  { format }  from "timeago.js";
const helpers ={};

helpers.timeago = (Timestamp) => {
    return format(Timestamp);
};
//Con esta funcion acepta el eq en handlebars
import Handlebars from 'handlebars';


Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

export default helpers;