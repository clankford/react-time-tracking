// Top level component, manages state for the timers and errors. 
// Children: EditableTimerList, ToggleableTimerForm
const TimersDashboard = React.createClass({
    getInitialState: function() {
        return {
            timers: [],
            isError: false,
            fieldErrors: null,
        };
    },
    componentDidMount: function() {
        this.loadTimersFromServer();
        setInterval(this.loadTimersFromServer, 5000);
    },
    loadTimersFromServer: function() {
        client.getTimers({
            success: (data) => {
                this.setState({timers: data});
            },
            error: () => {
                this.setState({isError: true});
            },
        });
    },
    handleCreateFormSubmit: function(timer) {
        this.createTimer(timer);
    },
    handleEditFormSubmit: function(attrs) {
        this.updateTimer(attrs);
    },
    handleDeleteTimer: function(attrs) {
        this.deleteTimer(attrs);
    },
    handleStartClick: function(timerId) {
        this.startTimer(timerId);
    },
    handleStopClick: function(timerId) {
        this.stopTimer(timerId);
    },
    handleToggleOptionsVisible: function(timerId, isVisible) {
        this.toggleOptionsVisible(timerId, isVisible);
    },
    createTimer: function(timer) {
        const t = helpers.newTimer(timer);
        this.setState({
            timers: this.state.timers.concat(t),
        });
        
        client.createTimer({
            data: timer,
            error: () => {
                this.setState({fieldErrors: t.id});
            },
        });
    },
    updateTimer: function(attrs) {
        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === attrs.id) {
                    return Object.assign({}, timer, {
                        title: attrs.title,
                        project: attrs.project,
                    });
                } else {
                    return timer;
                }
            }),
        });
        
        client.updateTimer({
            data: attrs,
            error: () => {
                this.setState({fieldErrors: attrs.id});
            },
        });
    },
    deleteTimer: function(attrs) {
        this.setState({
            timers: this.state.timers.filter((timer) => timer.id !== attrs.id),
        });
        
        client.deleteTimer({
            data: attrs,
        });
    },
    startTimer: function(timerId) {
        const now = Date.now();
        
        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === timerId) {
                    return Object.assign({}, timer, {
                        runningSince: now,
                    });
                } else {
                    return timer;
                }
            }),
        });
        
        client.startTimer({
            data: { id: timerId, start: now },
            error: () => {
                this.setState({isError: true});
            },
        });
    },
    stopTimer: function(timerId) {
        const now = Date.now();
        
        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === timerId) {
                    const lastElapsed = now - timer.runningSince;
                    return Object.assign({}, timer, {
                        elapsed: timer.elapsed + lastElapsed,
                        runningSince: null,
                    });
                } else {
                    return timer;
                }
            }),
        });
        
        client.stopTimer({
            data: { id: timerId, stop: now },
            error: () => {
                this.setState({isError: true});
            },
        });
    },
    toggleOptionsVisible: function(timerId, isVisible) {
        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === timerId) {
                    return Object.assign({}, timer, {
                        isOptionsVisible: isVisible
                    });
                } else {
                    return timer;
                }
            }),
        });
    },
    render: function() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    { this.state.isError ? <div className='ui red center aligned segment'><b>There was an error on the server.</b></div> : null }
                    <EditableTimerList 
                        timers={this.state.timers}
                        fieldErrors={this.state.fieldErrors}
                        onFormSubmit={this.handleEditFormSubmit}
                        onTimerDelete={this.handleDeleteTimer}
                        onStartClick={this.handleStartClick}
                        onStopClick={this.handleStopClick}
                        onMouseEnter={this.handleMouseEnter}
                        toggleOptionsVisible={this.handleToggleOptionsVisible}
                    />
                    <ToggleableTimerForm 
                        onFormSubmit={this.handleCreateFormSubmit}
                        fieldErrors={this.state.fieldErrors}
                    />
                </div>
            </div>
        );
    },
});

// List of timers, doesn't manage any state.
// Children: EditableTimer
const EditableTimerList = React.createClass({
    render: function() {
        const timers = this.props.timers.map((timer) => {
            return (
                <EditableTimer
                    key={timer.id}
                    id={timer.id}
                    title={timer.title}
                    project={timer.project}
                    elapsed={timer.elapsed}
                    runningSince={timer.runningSince}
                    isOptionsVisible={timer.isOptionsVisible}
                    fieldErrors={this.props.fieldErrors}
                    onFormSubmit={this.props.onFormSubmit}
                    onTimerDelete={this.props.onTimerDelete}
                    onStartClick={this.props.onStartClick}
                    onStopClick={this.props.onStopClick}
                    toggleOptionsVisible={this.props.toggleOptionsVisible}
                />
            );
        });
        return (
            <div id='timers'>
                {timers}
            </div>
        );
    },
});

// Individual timer that can be edited. manages validation state and open/closed state
// Children: TimerForm, Timer
const EditableTimer = React.createClass({
    getInitialState: function() {
        return (
            {
                editFormOpen: false,
                isFormValid: true,
            }
        );
    },
    handleEditClick: function() {
        this.openForm();
    },
    handleFormClose: function() {
        this.closeForm();
    },
    handleSubmit: function(timer) {
        this.props.onFormSubmit(timer);
        this.closeForm();
    },
    openForm: function() {
        this.setState({ editFormOpen: true });
    },
    closeForm: function() {
        this.setState({ editFormOpen: false });
    },
    render: function() {
        if (this.state.editFormOpen || this.props.fieldErrors === this.props.id) {
            return (
                <TimerForm
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    isFormValid={this.state.isFormValid}
                    fieldErrors={this.props.fieldErrors}
                    onFormSubmit={this.handleSubmit}
                    onFormClose={this.handleFormClose}
                    
                />
            );
        } else {
            return (
                <Timer
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                    isOptionsVisible={this.props.isOptionsVisible}
                    onEditClick={this.handleEditClick}
                    onDeleteClick={this.props.onTimerDelete}
                    onStartClick={this.props.onStartClick}
                    onStopClick={this.props.onStopClick}
                    toggleOptionsVisible={this.props.toggleOptionsVisible}
                />
            );
        }
    },
});

// Component to drive whether to show a plus button or a new timer form, manages state for form validation and if the form is open or closed.
// Children: TimerForm
const ToggleableTimerForm = React.createClass({
    getInitialState: function() {
        return {
            isOpen: false,
            isFormValid: true,
        };
    },
    handleFormOpen: function() {
        this.setState({ isOpen: true });
    },
    handleFormClose: function() {
        this.setState({ isOpen: false });
    },
    handleFromSubmit: function(timer) {
        if (timer.title && timer.project)
        {
            this.props.onFormSubmit(timer);
            this.setState({ isOpen: false, isFormValid: true });
        } else {
            this.setState({ isFormValid: false });
        }
    },
    render: function() {
        if (this.state.isOpen) {
            return (
                <TimerForm 
                    isFormValid={this.state.isFormValid}
                    fieldErrors={this.props.fieldErrors}
                    onFormSubmit={this.handleFromSubmit}
                    onFormClose={this.handleFormClose}
                />
            );
        } else {
            return (
                <div className='ui basic content center aligned segment'>
                    <button 
                        className='ui basic button icon'
                        onClick={this.handleFormOpen}
                    >
                        <i className='plus icon'></i>
                    </button>
                </div>
            );
        }
    }
});

// Form to edit and create a timer depending on if there is an ID assigned already.
// Children: None
const TimerForm = React.createClass({
    handleSubmit: function() {
        let id = this.props.id ? this.props.id : uuid();
        this.props.onFormSubmit({
            id: id,
            title: this.refs.title.value,
            project: this.refs.project.value
        });
    },
    render: function() {
        const submitText = this.props.id ? 'Update' : 'Create';
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form error'>
                        <div className='field'>
                            <label>Title</label>
                            <input type='text' ref='title' defaultValue={this.props.title} />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input type='text' ref='project' defaultValue={this.props.project} />
                        </div>
                        { this.props.isFormValid ? null : <div className='ui error message'>All fields are required!</div> }
                        { (this.props.fieldErrors && (this.props.fieldErrors === this.props.id)) ? <div className='ui error message'> There was a server error. This form did not submit.</div> : null }
                        <div className='ui two bottom attached buttons'>
                            <button 
                                className='ui basic blue button'
                                onClick={this.handleSubmit}
                            >
                                {submitText}
                            </button>
                            <button 
                                className='ui basic red button'
                                onClick={this.props.onFormClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});

// The timer itself, with edit and delete controls.
// Children: TimerActionButton
const Timer = React.createClass({
    componentDidMount: function() {
        this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
    },
    componentWillUnmount: function() {
        clearInterval(this.forceUpdateInterval);
    },
    handleDelete: function() {
        this.props.onDeleteClick({
            id: this.props.id
        });
    },
    handleStartClick: function() {
        this.props.onStartClick(this.props.id);
    },
    handleStopClick: function() {
        this.props.onStopClick(this.props.id);
    },
    handleToggleOnMouseEnter: function() {
        this.props.toggleOptionsVisible(this.props.id, true);
    },
    handleToggleOnMouseLeave: function() {
        this.props.toggleOptionsVisible(this.props.id, false);
    },
    render: function() {
        const elapsedString = helpers.renderElapsedString(
            this.props.elapsed, this.props.runningSince
        );
        return (
            <div className='ui centered card'>
                <div onMouseEnter={this.handleToggleOnMouseEnter} onMouseLeave={this.handleToggleOnMouseLeave} className='content'>
                    <div className='header'>
                        {this.props.title}
                    </div>
                    <div className='meta'>
                        {this.props.project}
                    </div>
                    <div className='center aligned description'>
                        <h2>
                            {elapsedString}
                        </h2>
                    </div>
                    <div className='extra content'>
                        <span 
                            className='right floated edit icon'
                            onClick={this.props.onEditClick}
                        >
                            { this.props.isOptionsVisible ? <i className='edit icon'></i> : null }
                        </span>
                        <span 
                            className='right floated trash icon'
                            onClick={this.handleDelete}
                        >
                            { this.props.isOptionsVisible ? <i className='trash icon'></i> : null }
                        </span>
                    </div>
                </div>
                <div className='ui bottom attached blue basic button'>
                    <TimerActionButton
                        timerIsRunning={!!this.props.runningSince}
                        onStartClick={this.handleStartClick}
                        onStopClick={this.handleStopClick}
                    />
                </div>
            </div>
        );
    },
});

// Buttons to control the timer running status.
// Children: None
const TimerActionButton = React.createClass({
    render: function() {
        if (this.props.timerIsRunning) {
            return (
                <div
                    className='ui bottom attached red basic button'
                    onClick={this.props.onStopClick}
                >
                    Stop
                </div>
            );
        } else {
            return (
                <div
                    className='ui bottom attached green basic button'
                    onClick={this.props.onStartClick}
                >
                    Start
                </div>
            );
        }
    },
});

ReactDOM.render(
    <TimersDashboard />,
    document.getElementById('content')
);