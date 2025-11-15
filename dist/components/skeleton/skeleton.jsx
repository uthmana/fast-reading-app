export function TableSkeleton() {
    return (<div className={"relative flex w-full flex-col overflow-hidden"}>
      <div className="flex w-full grow flex-col justify-between rounded-xl">
        <HeaderSkeleton />
        <div className="flex w-full flex-col divide-y rounded-lg bg-white px-6 py-5 dark:bg-navy-800">
          {[1, 2, 3, 4, 5, 6, 7].map(function (item, idx) {
            if (item === 1) {
                return <NewTableRowSkeleton key={idx} header={true}/>;
            }
            return <NewTableRowSkeleton key={idx}/>;
        })}
        </div>
      </div>
    </div>);
}
export function HeaderSkeleton() {
    return (<header className="relative mb-7 flex animate-pulse items-center justify-between gap-4 border-b bg-gray-100/0 py-3 dark:bg-navy-800/0">
      <div className="h-[38px] w-[200px]  rounded-lg bg-gray-200"></div>
      <div className="h-[34px] w-[100px]  rounded-lg bg-gray-200"></div>
    </header>);
}
export function NewTableRowSkeleton(props) {
    var header = props.header;
    if (header) {
        return (<div className="grid w-full grid-cols-5 py-5">
        {[1, 2, 3, 4, 5].map(function (item, idx) {
                return (<div key={idx} className="h-2 w-10 animate-pulse rounded-lg bg-gray-200 md:h-3 md:w-20"></div>);
            })}
      </div>);
    }
    return (<div className="grid w-full grid-cols-5 py-4">
      {[1, 2, 3, 4, 5].map(function (item, idx) {
            return (<div key={idx} className="flex animate-pulse flex-col gap-1">
            <div className="h-1 w-10 rounded-lg bg-gray-100 md:h-2 md:w-20"/>
            <div className="h-1 w-6 rounded-lg bg-gray-100 md:h-2 md:w-16"/>
          </div>);
        })}
    </div>);
}
