export interface JobManager <T>{
  initJobs: ()=>Promise<unknown>;
  upsertJob: (schedule: T)=>Promise<unknown>;
}