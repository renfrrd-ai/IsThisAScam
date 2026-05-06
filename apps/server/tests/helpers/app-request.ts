import { EventEmitter } from "node:events";
import type { Application } from "express";
import { createRequest, createResponse } from "node-mocks-http";

interface AppRequestOptions {
  method: string;
  url: string;
  query?: Record<string, string>;
  body?: unknown;
  ip?: string;
}

export async function invokeApp(app: Application, options: AppRequestOptions) {
  const request = createRequest({
    method: options.method,
    url: options.url,
    query: options.query,
    body: options.body,
    ip: options.ip ?? "127.0.0.1",
    headers: {
      "content-type": "application/json",
    },
  });

  const response = createResponse({
    eventEmitter: EventEmitter,
  });

  await new Promise<void>((resolve) => {
    response.on("end", () => resolve());
    app.handle(request, response);
  });

  return response;
}

