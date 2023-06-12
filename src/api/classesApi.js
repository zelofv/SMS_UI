import {get, post} from "@/tools/service";

export function getAllClasses(param) {
  return get('/classes/getAllClasses', param);
}

export function addClass(classes) {
  return post('/classes/addClass', classes);
}

export function updateClass(classes) {
  return post('/classes/updateClass', classes);
}

export function delClass(cid) {
  return post('/classes/delClass', cid);
}

export function arhClasses(list) {
  return post('/classes/archClasses', list);
}

export function selectClasses(list) {
  return post('/classes/selectClassesByKV', list);
}


