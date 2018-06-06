import React, {Component} from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
    Box,
    Flex,
    Heading
} from 'pcln-design-system';
import { fetchLinersRequest, fetchAuthorsRequest } from './actions';
import Feed from '../../components/Feed';
import { getAppState } from '../../containers/App/reducer';
import { getLinersTotal } from '../../services/DataService';


class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            linersSetIndex: 0,
            hasMoreItems: true,
            linersTotal: 0
        }
    }

    componentDidMount() {
        if (this.props.liners.length > 0) return;

        let linersTotal = getLinersTotal();

        this.setState({
            linersTotal
        })

        if (this.props.liners.length >= linersTotal) return;

        this.props.fetchLiners({
            linersSetIndex: this.state.linersSetIndex
        })
    }

    render() {
        return (
            <Flex justify="center" alignItems="center">

              <Box width={[ 0.9, 0.8, 0.6 ]} p={3}>
                  <Heading fontSize={3} mb={3} bold>Recent Quotes</Heading>

                  <InfiniteScroll
                    dataLength={this.props.liners.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.hasMoreItems}
                    loader={<h4 style={{textAlign: 'center'}}>Loading...</h4>}
                    endMessage={
                      <p style={{textAlign: 'center'}}>
                        <b>Homie, you done seen all the liners we got.</b>
                      </p>
                    }
                  >
                    <Feed
                        liners={this.props.liners}
                        linersSetIndex={this.state.linersSetIndex}
                        authors={this.props.authors}
                    />
                  </InfiniteScroll>

                  {!this.props.liners.length && <div>Sorry, No Liners are available</div>}

               </Box>
            </Flex>
        )
    }

    fetchMoreData = () => {
      // a fake async api call like which sends
      // 20 more records in 1.5 secs
      setTimeout(() => {

          if (this.state.hasMoreItems) {
              this.setState({
                linersSetIndex: this.state.linersSetIndex + 1,
                hasMoreItems: this.props.liners.length < this.state.linersTotal
              });

              this.props.fetchLiners({
                  linersSetIndex: this.state.linersSetIndex
              })
          }
      }, 1500);
    };
}

const mapStateToProps = (state) => {
    return {
        liners: getAppState(state).get('liners').toJS(),
        authors: getAppState(state).get('authors')
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchLiners: data => dispatch(fetchLinersRequest(data)),
        fetchAuthors: data => dispatch(fetchAuthorsRequest(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
