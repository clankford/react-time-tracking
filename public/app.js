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

const EditableTimer = React.createClass({
    render: function() {
        if (this.props.editFormOpen) {
            return (
                <TimerForm
                    title={this.props.title}
                    project={this.props.project}
                />
            );
        } else {
            return (
                <Timer
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                />
            );
        }
    },
});

const TimerForm = React.createClass({
    render: function() {
        const submitText = this.props.title ? 'Update' : 'Create';
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input type='text' defaultValue={this.props.title} />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input type='text' defaultValue={this.props.project} />
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button className='ui basic blue button'>
                                {submitText}
                            </button>
                            <button className='ui basic red button'>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});