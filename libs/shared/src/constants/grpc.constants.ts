import { join } from 'node:path';

export const GRPC_DEFAULT_HOST = '127.0.0.1';
export const GRPC_DEFAULT_PROTO_DIR = 'proto';

const getGrpcProtoDir = (): string =>
  process.env.GRPC_PROTO_DIR ?? GRPC_DEFAULT_PROTO_DIR;

export const GRPC_AUTH_PACKAGE = 'auth';
export const GRPC_AUTH_SERVICE_NAME = 'AuthService';
export const getGrpcAuthProtoPath = (): string =>
  process.env.AUTH_SERVICE_PROTO_PATH ??
  join(process.cwd(), getGrpcProtoDir(), 'auth.proto');
export const getGrpcAuthUrl = (): string =>
  process.env.AUTH_SERVICE_GRPC_URL ?? `${GRPC_DEFAULT_HOST}:50051`;

export const GRPC_PROJECT_PACKAGE = 'project';
export const GRPC_PROJECT_SERVICE_NAME = 'ProjectService';
export const getGrpcProjectProtoPath = (): string =>
  process.env.PROJECT_SERVICE_PROTO_PATH ??
  join(process.cwd(), getGrpcProtoDir(), 'project.proto');
export const getGrpcProjectUrl = (): string =>
  process.env.PROJECT_SERVICE_GRPC_URL ?? `${GRPC_DEFAULT_HOST}:50053`;

export const GRPC_ELEMENT_PACKAGE = 'element';
export const GRPC_ELEMENT_SERVICE_NAME = 'ElementService';
export const getGrpcElementProtoPath = (): string =>
  process.env.ELEMENT_SERVICE_PROTO_PATH ??
  join(process.cwd(), getGrpcProtoDir(), 'element.proto');
export const getGrpcElementUrl = (): string =>
  process.env.ELEMENT_SERVICE_GRPC_URL ?? `${GRPC_DEFAULT_HOST}:50052`;
