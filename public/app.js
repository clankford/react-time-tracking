const TimersDashboard = React.createClass({
    render: function() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList />
                    <ToggleableTimerForm
                        isOpen={true}
                    />
                </div>
            </div>
        );
    },
});

const EditableTimerList = React.createClass({
    render: function() {
        return (
            <div id='timers'>
                <EditableTimer
                    title='Learn React'
                    project='Build timer application'
                    elapsed='8986300'
                    runningSince={null}
                    editFormOpen={false}
                />
                <EditableTimerList
                    title='Learn Angular 2'
                    project='Build chat application'
                    elapsed='3890985'
                    runningSince={null}
                    editFormOpen={true}
                />
            </div>
        );
    },
});