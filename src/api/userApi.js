import {get, post} from "@/tools/service";

export function getUser() {
    return get('/userInfo', null);
}

export function getClasses() {
    return get('/classes', null);
}

export function getClassInfo(courseId) {
    return get('/classInfo', {courseId:courseId});
}
