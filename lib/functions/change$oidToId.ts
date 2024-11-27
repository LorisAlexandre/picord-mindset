export function change$oidToId(object: { [key: string]: any }): {
  [key: string]: any;
} {
  function transform(value: any): any {
    if (Array.isArray(value)) {
      return value.map(transform);
    } else if (value && typeof value === "object") {
      if ("$oid" in value) {
        return value["$oid"];
      } else if ("_id" in value) {
        value["id"] = value["_id"];
        delete value["_id"];
      }

      return Object.fromEntries(
        Object.entries(value).map(([key, val]) => [key, transform(val)])
      );
    }
    return value;
  }

  return transform(object);
}
