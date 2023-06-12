import {post} from "@/tools/service";

export function login(param) {
    return post('/login', param);
}
