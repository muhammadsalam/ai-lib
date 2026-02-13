export interface FuncitonSpecs {
    name: string;
    description: string;
    args?: string;
}

export interface Generated {
    name: string;
    path: string;
    model: string;
}

export interface MetadataIndex {
  [hash: string]: Generated;
}
