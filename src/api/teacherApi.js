import {get, post} from "@/tools/service";

export function getAllTeacher(param) {
  return get('/teacher/getAllTeacher', param);
}

export function addTeacher(teacher) {
  return post('/teacher/addTeacher', teacher);
}

export function updateTeacher(teacher) {
  return post('/teacher/updateTeacher', teacher);
}

export function delTeacher(tid) {
  return post('/teacher/delTeacher', tid);
}

export function delTeachers(list) {
  return post('/teacher/delTeachers', list);
}

export function selectTeacher(list) {
  return post('/teacher/selectTeacherByKV', list);
}


