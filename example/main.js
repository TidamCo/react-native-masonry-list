
import React, { Component, PureComponent } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import MasonryList from '@appandflow/masonry-list';

const COLORS = ['green', 'blue', 'red'];

class Cell extends PureComponent {
    componentDidMount() {
        console.log('mount cell');
    }

    componentWillUnmount() {
        console.log('unmount cell');
    }

    render() {
        const { item } = this.props;
        return (
            <View
                style={[
                    styles.cell,
                    { height: item.height, backgroundColor: item.color },
                ]}
            >
                <Text>{item.id}</Text>
            </View>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { isRefreshing: false, data: [] };
        setTimeout(this._addData, 1000);
    }

    _addData = (reset = false) => {
        const initialIndex = !!reset ? 0 : this.state.data.length;
        const newData = Array.from({ length: 20 }).map((_, i) => ({
          id: `item_${i + initialIndex}`,
          height: Math.round(Math.random() * 100 + 50),
          color: COLORS[(i + initialIndex) % COLORS.length],
        }));
        this.setState({
            data: !!reset ? newData : this.state.data.concat(newData),
            isRefreshing: false,
        });
    }

    _refreshRequest = () => {
        this.setState({ isRefreshing: true });
        setTimeout(() => this._addData(true), 1000);
    }

    _renderHeader = () => {
        return (
            <View style={{ flex:1, height: 100, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Mon header</Text>
            </View>
        );
    }

    _renderFooter = () => {
        return (
            <View style={{ flex:1, height: 100, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    _onEndReached = () => {
        setTimeout(this._addData, 1000);
    }

    render() {
        return (
            <MasonryList
                onRefresh={this._refreshRequest}
                refreshing={this.state.isRefreshing}
                data={this.state.data}
                renderItem={({ item }) => <Cell item={item} />}
                getHeightForItem={({ item }) => item.height + 11}
                numColumns={2}
                keyExtractor={item => item.id}
                ListHeaderComponent={this._renderHeader}
                ListFooterComponent={this._renderFooter}
                onEndReached={this._onEndReached}
                onEndReachedThreshold={0.2}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                verticalSeparatorWidth={10}
            />
        );
    }
}

const styles = StyleSheet.create({
    cell: {
        margin: 1,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default App;
