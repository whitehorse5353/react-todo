(function () {
    'use strict';

    /** @jsx React.DOM */
    var BaseComponent = React.createClass({
        render: function () {
            return (
                <form action='javascript:void(0)' onSubmit={this.formHandler}>
                    <div className='container'>
                        <input type='text' placeholder='what todo ?' className='form-control' onChange={this.itemListener} value={this.state.fieldValue} />
                    </div>
                    <ItemList data={this.state.listOfItems} dataStateUpdate={this.updateState} scope={this}/>
                </form>
            )
        },
        formHandler: function () {
            if (this.state.fieldValue) {
                this.state.listOfItems.push({
                    todoName: this.state.fieldValue
                });
                this.setState({fieldValue: ''});
            }
        },
        itemListener: function (e) {
            this.setState({fieldValue: e.target.value});
        },
        getInitialState: function () {
            return {fieldValue: '', listOfItems: [], routeState: 'all'}
        },
        updateState: function () {
            this.setState();
        }
    });

    var ItemList = React.createClass({
        render: function () {
            var self = this;
            var reactEl = self.props.data.map(function (item, index) {
                if (self.routeFiltering(self.props.scope.state.routeState, item.state)) {
                    return <RouteFilter index={index} onDoubleClick={self.editItemValue} scope={self} item={item} removeItemFromList={self.removeItemFromList} itemCompleted={self.itemCompleted} />
                }
            });
            return (
                <div className='todo-wrapper container'>
                    <ul className='list-unstyled table table-condensed'>{reactEl}</ul>
                    {self.props.data.length ? <StatusBar data={self.props.data} count={self.getOpenItems} dataFilter={this.filterItems} clearCompleted={self.clearCompletedItem} /> : null}
                </div>
            )
        },
        routeFiltering: function (route, state) {
            if (route === 'all') {
                return true;
            } else if (route === 'active' && !state) {
                return true;
            } else if (route === 'completed' && state) {
                return true;
            }
        },
        editItemValue: function (e) {
            this.props.data[e.currentTarget.id]['editMode'] = true;
            this.props.dataStateUpdate();
        },
        itemCompleted: function (e) {
            var itemId = e.target.parentNode.parentNode.id,
                itemState = e.target.checked;
            this.props.data[itemId]['state'] = itemState ? true : false;
            this.props.dataStateUpdate();
        },
        getOpenItems: function () {
            var count = 0,
                op = {};
            this.props.data.map(function (item) {
                if (item.state) {
                    count += 1;
                }
            });
            op['count'] = this.props.data.length - count;
            op['completedCount'] = count;
            return op;
        },
        removeItemFromList: function (e) {
            this.props.data.splice(e.target.parentNode.parentNode.parentNode.id, 1);
            this.props.dataStateUpdate();
        },
        clearCompletedItem: function () {
            this.props.scope.state.listOfItems = this.props.data.filter(function (item) {
                if (!item.state) {
                    return item;
                }
            });
            this.props.dataStateUpdate();
        },
        filterItems: function (e) {
            this.props.scope.state.routeState = e.target.id;
            this.props.dataStateUpdate();
        }
    });

    var RouteFilter = React.createClass({
        render: function () {
            return (
                <li onDoubleClick={this.props.onDoubleClick} id={this.props.index}>
                {this.props.item.editMode ? <EditItemTemplate scope={this.props.scope} item={this.props.item} /> : <ItemTemplate removeItemFromList={this.props.removeItemFromList} itemCompleted={this.props.itemCompleted}  item={this.props.item} />}
                </li>
            )
        }
    });

    var ItemTemplate = React.createClass({
        render: function () {
            return (
                <span>
                    <input type='checkbox' checked = {this.props.item.state ? 'checked' : ''} onChange={this.props.itemCompleted} />
                {this.props.item.state ? <del>{this.props.item.todoName}</del> : this.props.item.todoName}
                    <button type='button' onClick={this.props.removeItemFromList} className='close' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                </span>
            )
        }
    });

    var EditItemTemplate = React.createClass({
        render: function () {
            return (
                <span>
                    <input type='text' className='form-control' value={this.props.item.todoName} onChange={this.updatedItemValue} onBlur={this.listenToUpdate} autoFocus='autofocus' onFocus={this.handleMouseDown} />
                </span>
            )
        },
        updatedItemValue: function (e) {
            this.props.item.todoName = e.target.value;
            this.props.scope.props.dataStateUpdate();
        },
        listenToUpdate: function (e) {
            if (e.relatedTarget === null || !e.target.isSameNode(e.relatedTarget)) {
                this.props.item.editMode = false;
                this.props.scope.props.dataStateUpdate();
            }
        },
        handleMouseDown: function (e) {
            if (e.target.isSameNode && e.target.isSameNode(e.relatedTarget)) {
                this.props.item.editMode = false;
            }
        }
    });

    var StatusBar = React.createClass({
        render: function () {
            return (
                <div className='status-bar row'>
                    <div className='items-left col-xs-3'>{this.getCount('open')} items left</div>
                    <ul className='list-inline col-xs-5'>
                        <li>
                            <a href='javascript:void(0)' onClick={this.props.dataFilter} id='all'>All</a>
                        </li>
                        <li>
                            <a href='javascript:void(0)' onClick={this.props.dataFilter} id='active'>Active</a>
                        </li>
                        <li>
                            <a href='javascript:void(0)' onClick={this.props.dataFilter} id='completed'>Completed</a>
                        </li>
                    </ul>
                    {this.getCount() ? <a href='javascript:void(0)' className='col-xs-4' onClick={this.props.clearCompleted}> clear completed</a> : null}
                </div>
            )
        },
        getCount: function (state) {
            return state ? this.props.count().count : this.props.count().completedCount;
        }
    });

    React.render(<BaseComponent />, document.getElementById('master'));

}());