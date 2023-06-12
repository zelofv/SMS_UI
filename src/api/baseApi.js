import {get} from "@/tools/service";

export function getMenu(id) {
  return get("/getMenu", id);
}

export function getLoginUser(uid) {
  return get("/getLoginUser", uid);
}

export function getTreeNode(role) {
  return get("/base/getTreeNode", role);
}
