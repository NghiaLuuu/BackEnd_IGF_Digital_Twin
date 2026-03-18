import { join } from 'node:path';

export const GRPC_DEFAULT_HOST = '127.0.0.1';

export const GRPC_AUTH_PACKAGE = 'auth';
export const GRPC_AUTH_SERVICE_NAME = 'AuthService';
export const GRPC_AUTH_PROTO_PATH = join(process.cwd(), 'proto/auth.proto');
export const GRPC_AUTH_URL =
  process.env.AUTH_SERVICE_GRPC_URL ?? `${GRPC_DEFAULT_HOST}:50051`;

export const GRPC_PROJECT_PACKAGE = 'project';
export const GRPC_PROJECT_SERVICE_NAME = 'ProjectService';
export const GRPC_PROJECT_PROTO_PATH = join(
  process.cwd(),
  'proto/project.proto',
);
export const GRPC_PROJECT_URL =
  process.env.PROJECT_SERVICE_GRPC_URL ?? `${GRPC_DEFAULT_HOST}:50053`;

export const GRPC_ELEMENT_PACKAGE = 'element';
export const GRPC_ELEMENT_SERVICE_NAME = 'ElementService';
export const GRPC_ELEMENT_PROTO_PATH = join(
  process.cwd(),
  'proto/element.proto',
);
export const GRPC_ELEMENT_URL =
  process.env.ELEMENT_SERVICE_GRPC_URL ?? `${GRPC_DEFAULT_HOST}:50052`;
