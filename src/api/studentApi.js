import {get, post} from "@/tools/service";

export function getAllStudent(param) {
  return get('/student/getAllStudent', param);
}

export function addStudent(student) {
  return post('/student/addStudent', student);
}

export function updateStudent(student) {
  return post('/student/updateStudent', student);
}

export function delStudent(sid) {
  return post('/student/delStudent', sid);
}

export function delStudents(list) {
  return post('/student/delStudents', list);
}

export function selectStudent(list) {
  return post('/student/selectStudentByKV', list);
}


