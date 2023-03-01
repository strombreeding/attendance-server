export type CreateAttendance = {
    name: string;
    list: AttendanceList;
};
export type AttendanceList = Array<Attendance>;
export type Attendance = {
    index: number;
    attend: string;
};
