import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

import {
  Table,
  TableBody,
  TableHeader,
  TableFooter,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import ItemUpdate from './ItemUpdate';
import ItemSetupContainer from '././../../containers/ItemSetupContainer';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Delete from 'material-ui/svg-icons/action/delete';
import Cancel from 'material-ui/svg-icons/content/clear';
import FilterList from 'material-ui/svg-icons/content/filter-list';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Search from 'material-ui/svg-icons/action/search';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import ArrowDropLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ArrowDropRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import More from 'material-ui/svg-icons/navigation/more-horiz';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import styles from './styles';

@Radium
export default class Inventory extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    selectedItems: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
    suppliers: PropTypes.array.isRequired,
    isDeletionEnabled: PropTypes.bool.isRequired,
    rowItemEdit: PropTypes.number.isRequired,
    more: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object]).isRequired,
  }

  constructor() {
    super();

    this.state = { selectedRows: [] };
  }

  componentWillMount() {
    this.props.actions.fetchInventoryItems();
  }

  _selectRows = rowIndex => {
    const { actions } = this.props;

    this.setState({ selectedRows: rowIndex });

    if (rowIndex === 'all') actions.selectAllItems();
    else if (rowIndex === 'none') actions.unselectAllItems();
    else actions.selectItems(rowIndex);
  }

  _removeSelectedItems = (e) => {
    const { actions, selectedItems } = this.props;

    e.preventDefault();
    actions.removeItems(selectedItems);
  }

  render() {
    const {
      actions,
      categories,
      items,
      selectedItems,
      isDeletionEnabled,
      rowItemEdit,
      brands,
      suppliers,
      initialValues,
      more,
    } = this.props;

    const ItemSelectedLength = () => (
      <div style={styles.selectedLength}>
        <IconButton onTouchTap={actions.toggleDeletion} touch>
          <Cancel />
        </IconButton>
        <span style={{ position: 'relative', bottom: '6px' }}>
          {selectedItems.length}&nbsp;
          {selectedItems.length > 1 ? 'items' : 'item'}&nbsp;
          selected
        </span>
      </div>
    );

    return (
      <div style={styles.container}>
        <Paper zDepth={1} className="col-xs-11" style={{ padding: 0 }}>
          <Table
            onRowSelection={this._selectRows}
            multiSelectable={isDeletionEnabled}
            height={"65vh"}
            fixedHeader
            fixedFooter
          >
            <TableHeader adjustForCheckbox={isDeletionEnabled} displaySelectAll={isDeletionEnabled}>
              <TableRow
                onTouchTap={(e) => e.preventDefault()}
              >
                <TableHeaderColumn colSpan="7">
                  <div style={styles.superheader}>
                    {isDeletionEnabled ?
                      <ItemSelectedLength />
                        : <div style={{ display: 'inline-flex' }}>
                          <ItemSetupContainer disabled={rowItemEdit !== -1} />
                          <FlatButton
                            label="Remove"
                            onTouchTap={actions.toggleDeletion}
                            disabled={rowItemEdit !== -1}
                            primary
                          />
                        </div>}
                    <div>
                      <div style={{ display: 'inline-flex' }}>
                        <TextField
                          hintText="Search by item name"
                          onChange={(e) => actions.searchItem(e.target.value.trim())}
                          fullWidth
                        />
                      </div>
                      <IconButton onTouchTap={isDeletionEnabled ? this._removeSelectedItems : null}>
                        {isDeletionEnabled ?
                          <Delete onTouchTap={this._removeSelectedItems} />
                            : <Search disabled={rowItemEdit !== -1} />}
                      </IconButton>
                      <IconMenu iconButtonElement={<IconButton><FilterList /></IconButton>}>
                        <MenuItem
                          primaryText="All"
                          style={{ textAlign: 'center' }}
                          disabled={rowItemEdit !== -1}
                          onTouchTap={() => actions.changeFilter('All')}
                        />
                        <Divider inset />
                        <MenuItem
                          primaryText="Category"
                          leftIcon={<ArrowDropLeft />}
                          menuItems={
                            categories.map(cat => (
                              <MenuItem
                                value={cat}
                                primaryText={cat}
                                onTouchTap={() => actions.changeFilter('category', cat)}
                              />))}
                        />
                        <MenuItem
                          primaryText="Brand"
                          leftIcon={<ArrowDropLeft />}
                          menuItems={
                            brands.map(brand => (
                              <MenuItem
                                value={brand}
                                primaryText={brand}
                                onTouchTap={() => actions.changeFilter('brand', brand)}
                              />)
                          )}
                        />
                        <MenuItem
                          primaryText="Supplier"
                          leftIcon={<ArrowDropLeft />}
                          menuItems={
                            suppliers.map(sup => (
                              <MenuItem
                                value={sup}
                                primaryText={sup}
                                onTouchTap={() => actions.changeFilter('supplier', sup)}
                              />)
                          )}
                        />
                      </IconMenu>
                    </div>
                  </div>
                </TableHeaderColumn>
              </TableRow>
              <TableRow>
                <TableHeaderColumn>ID</TableHeaderColumn>
                <TableHeaderColumn>Item</TableHeaderColumn>
                <TableHeaderColumn>Product Cost</TableHeaderColumn>
                <TableHeaderColumn>Selling Price</TableHeaderColumn>
                <TableHeaderColumn>Stock</TableHeaderColumn>
                <TableHeaderColumn>More</TableHeaderColumn>
                <TableHeaderColumn />
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={isDeletionEnabled} stripedRows>
              {items.map((item, i) => {
                if (rowItemEdit === i) {
                  return (
                    <ItemUpdate
                      key={item.id}
                      item={item}
                      editRowItem={actions.editRowItem}
                      updateItem={actions.updateItem}
                      initialValues={initialValues}
                      loadInitialValues={actions.loadInitialValues}
                      selected={this.state.selectedRows.indexOf(i) !== -1}
                    />
                  );
                }

                return ( // TODO: select all checkboxes is throws an error map undefined
                  <TableRow key={item.id} selected={this.state.selectedRows.indexOf(i) !== -1}>
                    <Dialog
                      title="More Data"
                      open={more && true}
                      onRequestClose={actions.hideMore}
                      autoScrollBodyContent
                    >
                      <img
                        src={item.image || './static/placeholder.jpg'}
                        alt={item.name}
                        width="250"
                        height="250"
                      />
                      <br />
                      Category {item.category}
                      <br />
                      Brand: {item.brand}
                      <br />
                      Supplier: {item.supplier}
                      <br />
                      Description: {item.description}
                    </Dialog>
                    <TableRowColumn>{item.id}</TableRowColumn>
                    <TableRowColumn>{item.name}</TableRowColumn>
                    <TableRowColumn>{item.cost}</TableRowColumn>
                    <TableRowColumn>{item.sellingPrice}</TableRowColumn>
                    <TableRowColumn>{item.stock} / {item.initialStock}</TableRowColumn>
                    <TableRowColumn>
                      <IconButton onTouchTap={() => actions.showMore(item)} touch>
                        <More />
                      </IconButton>
                    </TableRowColumn>
                    <TableRowColumn>
                      <IconButton onTouchTap={() => actions.editRowItem(i)} touch>
                        <ModeEdit />
                      </IconButton>
                    </TableRowColumn>
                    <Table />
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableRowColumn />
                <TableRowColumn />
                <TableRowColumn />
                <TableRowColumn />
                <TableRowColumn />
                <TableRowColumn />
                <TableRowColumn>
                  <IconButton touch>
                    <ArrowDropLeft />
                  </IconButton>
                  <IconButton touch>
                    <ArrowDropRight />
                  </IconButton>
                </TableRowColumn>
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      </div>
    );
  }
}