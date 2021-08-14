import kebabCase from "lodash/kebabCase";

import type { Options } from "../types";

function buildFullUrl({
  baseUrl,
  id,
  // Set default name
  name = "",
  // Set default path
  path = "",
  customPath,
  query,
  queryStringParser,
  // Set kebabCase as default url parser
  urlParser = kebabCase,
}: Options) {
  let url = baseUrl || "",
    endpoint = urlParser(name + path),
    qs = "";

  if (id && !customPath) {
    endpoint += `/${id}`;
  }

  // Replace id wildcard if exists
  if (customPath) {
    endpoint = id ? customPath.replace(":id", String(id)) : customPath;
  }

  // Remove any extra amount of slashes
  endpoint = endpoint.replace(/\/\/+/g, "/");

  // Using substring method to remove unnecessary slash
  if (endpoint.indexOf("/") == 0) {
    endpoint = endpoint.substring(1, endpoint.length);
  }

  if (endpoint && url.lastIndexOf("/") != url.length - 1) {
    url += "/";
  }

  url += endpoint;

  // Using higher order functions to improve code readability
  if (query) {
    Object.keys(query).forEach((key) => {
      const value = query[key];
      if (value == null || Number.isNaN(value) || typeof value == undefined) {
        delete query[key];
      }
    });

    const options = Object.keys(query);

    options.forEach((option, i) => {
      const value = query[option];
      const name = queryStringParser ? queryStringParser(option) : option;

      if (
        ["string", "number", "boolean"].includes(typeof value) &&
        !Number.isNaN(value)
      ) {
        qs += `${name}=${value}`;
      } else {
        const queryValues = value as Array<any>;

        queryValues.forEach((item, j) => {
          qs += `${name}[]=${item}`;

          if (j < queryValues.length - 1) {
            qs += "&";
          }
        });
      }

      if (i < options.length - 1) qs += "&";
    });
  }

  // Using substring method to remove unnecessary slash
  if (url.lastIndexOf("/") == url.length - 1) {
    url = url.substring(0, url.length - 1);
  }

  if (qs.length) {
    url += `?${qs}`;
  }

  return url;
}

export default buildFullUrl;
