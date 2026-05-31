export declare const DB_PROVIDER = "DbProvider";
export declare const InjectDb: () => PropertyDecorator & ParameterDecorator;
export declare const dbProvider: {
    provide: string;
    useValue: import("drizzle-orm/node-postgres").NodePgDatabase<Record<string, never>> & {
        $client: import("pg").Pool;
    };
};
