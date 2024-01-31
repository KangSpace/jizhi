import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { InlineAlert, toaster } from 'evergreen-ui';
import waves from './sketchs/waves';
import blobs from './sketchs/blobs';
import Verses from './components/Verses';
import ConfigMenu from './components/ConfigMenu';
import SearchInput from './components/SearchInput';
import ColorName from './components/ColorName';
import { saveBackground, insertFont, fetchAndSetFont, pickColor } from './utils';
import Storager from './utils/storager';
import { load as jrscLoad } from './utils/jinrishici';
import { load } from './utils/jsonDataLoader';
import {
  HORIZONTAL,
  VERTICAL,
  WAVES,
  GOOGLE_SEARCH,
  DEFAULT_SHICI,
  DEFAULT_FONT,
} from './constants/appConstants';
import GlobalStyle from './components/GlobalStyle';

const DEFAULT_SHICI_LIST = require('./constants/shici.json');
const LOCAL_DATA_KEY = 'LOCAL_DATA';
const LOCAL_DATA_UPDATE_TIME_KEY = 'LOCAL_DATA_UPDATE_TIME';
const LOCAL_DATA_DEFAULTDATASOURCECHECKED_KEY = 'defaultDataSourceChecked';
const LOCAL_DATA_CUSTOMDATASOURCEURL_KEY = 'customDataSourceUrl';

/**
 * 自定义数据URL
 * @type {string}
 */
const CUSTOM_DATA_URL = 'https://kangspace.org/jizhi/jizhi_data.json';
// const CUSTOM_DATA_WITH_TOKEN_URL = CUSTOM_DATA_URL + '?token=';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: true,
      showSearchBarChecked: false,
      darkModeChecked: false,
      defaultPlayChecked: true,
      colorStayChecked: false,
      verses: DEFAULT_SHICI,
      versesLayout: HORIZONTAL,
      errMessage: '',
      engineOption: GOOGLE_SEARCH,
      value: '',
      focused: false,
      fontName: DEFAULT_FONT,
      waveColor: pickColor(false),
      defaultDataSourceChecked: true,
      customDataSourceUrl: '',
    };
  }

  componentDidMount() {
    const hasZh = navigator.languages.includes('zh');
    document.title = hasZh ? '新标签页' : 'New Tab';
    // 按时间更新,每分钟更新一次
    this.loadData();
    Storager.get(
      [
        'verses',
        'versesLayout',
        'selected',
        'colorStayChecked',
        'defaultPlayChecked',
        'engineOption',
        'showSearchBarChecked',
        'fontName',
        'fonts',
        'darkModeChecked',
        'defaultDataSourceChecked',
        'customDataSourceUrl',
      ],
      (res) => {
        if (res.fonts && res.fontName === res.fonts.fontName) {
          insertFont(res.fonts.value);
        }
        this.setState({
          showSearchBarChecked: !!res.showSearchBarChecked,
          darkModeChecked: !!res.darkModeChecked,
          colorStayChecked: !!res.colorStayChecked,
          defaultPlayChecked: res.defaultPlayChecked !== false,
          isVerticalVerses: res.versesLayout === VERTICAL,
          isPlaying: res.defaultPlayChecked !== false,
          verses: res.verses || DEFAULT_SHICI,
          selected: res.selected || WAVES,
          engineOption: res.engineOption || GOOGLE_SEARCH,
          fontName: res.fontName || DEFAULT_FONT,
          waveColor: pickColor(!!res.darkModeChecked),
          defaultDataSourceChecked: res.defaultDataSourceChecked,
          customDataSourceUrl: res.customDataSourceUrl || CUSTOM_DATA_URL,
        });
      }
    );
  }

  /**
   * 加载数据
   * 从缓存中加载数据,并定时更新(每分钟更新一次)
   */
  loadData(next) {
    Storager.get(
      [
        LOCAL_DATA_KEY,
        LOCAL_DATA_UPDATE_TIME_KEY,
        LOCAL_DATA_DEFAULTDATASOURCECHECKED_KEY,
        LOCAL_DATA_CUSTOMDATASOURCEURL_KEY,
      ],
      (data) => {
        let defaultDataSourceChecked = data[LOCAL_DATA_DEFAULTDATASOURCECHECKED_KEY];
        if (defaultDataSourceChecked && eval(defaultDataSourceChecked)) {
          // 加载今日诗词
          jrscLoad(
            (result) => {
              Storager.set({ verses: result.data });
            },
            (err) => {
              this.setState({ errMessage: err.errMessage });
              const localShici =
                DEFAULT_SHICI_LIST[Math.floor(Math.random() * DEFAULT_SHICI_LIST.length)];
              Storager.set({ verses: localShici });
            }
          );
          if (next) next();
          return;
        }
        // 加载自定义数据源
        let customDataSourceUrl = data[LOCAL_DATA_CUSTOMDATASOURCEURL_KEY] || CUSTOM_DATA_URL;
        let localData = data[LOCAL_DATA_KEY];
        let localDataUpdateTime = data[LOCAL_DATA_UPDATE_TIME_KEY];
        // 30s更新一次
        if (!localDataUpdateTime || localDataUpdateTime < new Date().getTime() - 30 * 1000) {
          localData = null;
        }
        if (!localData) {
          console.log('load remote.');
          load(
            customDataSourceUrl,
            (result) => {
              let localData = {};
              localData[LOCAL_DATA_KEY] = result.data;
              Storager.set(localData);
              let localDataUpdateTime = {};
              localDataUpdateTime[LOCAL_DATA_UPDATE_TIME_KEY] = new Date().getTime();
              Storager.set(localDataUpdateTime);
              Storager.set({ verses: this.randomData(result.data) });
              if (next) next();
            },
            (err) => {
              this.setState({ errMessage: err.errMessage });
              const localShici =
                DEFAULT_SHICI_LIST[Math.floor(Math.random() * DEFAULT_SHICI_LIST.length)];
              Storager.set({ verses: localShici });
              if (next) next();
            }
          );
        } else {
          console.log('load local.');
          Storager.set({ verses: this.randomData(localData) });
          if (next) next();
        }
      }
    );
  }

  /**
   * 获取随机数据
   * @param data array data
   * @returns {*}
   */
  randomData(data) {
    return data[Math.floor(Math.random() * data.length)];
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.darkModeChecked !== this.state.darkModeChecked) {
      this.setState(() => ({ waveColor: pickColor(this.state.darkModeChecked) }));
    }
  }

  handlePlayPauseSelect = () => this.setState((state) => ({ isPlaying: !state.isPlaying }));

  handleShowSearchBarChange = () => {
    this.setState(
      (state) => ({
        showSearchBarChecked: !state.showSearchBarChecked,
      }),
      () => {
        Storager.set({ showSearchBarChecked: this.state.showSearchBarChecked });
      }
    );
  };
  handleShowTranslate = () => {
    this.setState((state) => ({
      isShowTranslate: !state.isShowTranslate,
    }));
  };

  handleDarkModeChange = () => {
    this.setState(
      (state) => ({
        darkModeChecked: !state.darkModeChecked,
      }),
      () => {
        Storager.set({ darkModeChecked: this.state.darkModeChecked });
      }
    );
  };

  handleVersesLayoutChange = () => {
    this.setState(
      (state) => ({
        isVerticalVerses: !state.isVerticalVerses,
      }),
      () => {
        Storager.set({
          versesLayout: this.state.isVerticalVerses ? VERTICAL : HORIZONTAL,
        });
      }
    );
  };

  handleDefaultPlayChange = () => {
    this.setState(
      (state) => ({
        defaultPlayChecked: !state.defaultPlayChecked,
      }),
      () => {
        Storager.set({ defaultPlayChecked: this.state.defaultPlayChecked });
      }
    );
  };

  handleColorStayChange = () => {
    this.setState(
      (state) => ({
        colorStayChecked: !state.colorStayChecked,
      }),
      () => {
        Storager.set({ colorStayChecked: this.state.colorStayChecked });
      }
    );
  };

  handleBgOptionChange = (selected) => {
    this.setState({ selected }, () => {
      Storager.set({ selected });
    });
  };

  handleKeyDown = ({ keyCode, altKey }) => {
    // space
    if (keyCode === 32) this.setState((state) => ({ isPlaying: !state.isPlaying }));
    // S + alt
    if (keyCode === 83 && altKey) saveBackground();

    // left or right arrow keys
    if (keyCode === 37 || keyCode === 39) {
      this.setState(() => ({ waveColor: pickColor(this.state.darkModeChecked) }));
    }
  };

  handleFontTypeChange = (fontName) => {
    if (fontName !== DEFAULT_FONT) {
      this.setState(() => ({ isFontLoading: true }));

      Storager.get(['fonts'], (res) => {
        if (res.fonts && res.fonts.fontName === fontName) {
          insertFont(res.fonts.value);
          this.setState(() => ({ isFontLoading: false }));
        } else {
          fetchAndSetFont(fontName)
            .then(() => {
              this.setState(() => ({ isFontLoading: false }));
            })
            .catch((err) => console.log(err));
        }
      });
    }

    this.setState({ fontName }, () => Storager.set({ fontName }));
  };

  /**
   * 默认数据源选择修改事件
   */
  handleDefaultDataSourceCheckedChange = () => {
    this.setState(
      (state) => ({
        defaultDataSourceChecked: !state.defaultDataSourceChecked,
      }),
      () => {
        let defaultDataSourceChecked = this.state.defaultDataSourceChecked;
        if (defaultDataSourceChecked) {
          Storager.set({ defaultDataSourceChecked: defaultDataSourceChecked });
          this.handleDataSourceChanged();
        }
      }
    );
  };

  /**
   * 自定义数据源URL修改
   */
  handleCustomDataSourceUrlChange = (newVal) => {
    this.setState(() => ({ customDataSourceUrl: newVal }));
  };

  /**
   * 确认自定义数据源URL修改
   */
  onCustomDataSourceUrlChangeConfirm = () => {
    let newVal = this.state.customDataSourceUrl;
    let urlRegexp =
      /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\\.,@?^=%&:/~\\+#]*[\w\-\\@?^=%&/~\\+#])?/;
    if (!newVal || !urlRegexp.test(newVal)) {
      toaster.notify('请输入正确的URL!');
      return false;
    }
    // 保存数据
    this.setState(
      () => ({}),
      () => {
        Storager.set({ defaultDataSourceChecked: this.state.defaultDataSourceChecked });
        Storager.set({ customDataSourceUrl: this.state.customDataSourceUrl });
        this.handleDataSourceChanged();
      }
    );
  };

  handleDataSourceChanged() {
    toaster.success('数据源切换成功');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  handleEngineOptionChange = (engineOption) =>
    this.setState({ engineOption }, () => Storager.set({ engineOption }));

  handleChange = ({ target: { value } }) => this.setState({ value });

  handleFocus = () => this.setState({ focused: true });

  handleBlur = () => this.setState({ focused: false });

  render() {
    const {
      verses,
      isVerticalVerses,
      isShowTranslate,
      isPlaying,
      showSearchBarChecked,
      defaultPlayChecked,
      colorStayChecked,
      selected,
      errMessage,
      engineOption,
      value,
      focused,
      fontName,
      darkModeChecked,
      waveColor,
      isFontLoading,
      defaultDataSourceChecked,
      customDataSourceUrl,
    } = this.state;
    const sketches = { blobs, waves };

    return selected ? (
      <div className="App" tabIndex="-1" onKeyDown={this.handleKeyDown}>
        <GlobalStyle />
        {selected === WAVES && (
          <ColorName
            key={waveColor.name}
            fontName={fontName}
            colorName={waveColor.name}
            colorStayChecked={colorStayChecked}
            isDarkMode={darkModeChecked}
          />
        )}
        <Verses
          key={isVerticalVerses}
          bgOption={selected}
          verses={verses}
          isVerticalVerses={isVerticalVerses}
          engineOption={engineOption}
          isDarkMode={darkModeChecked}
          fontName={fontName}
          isShowTranslate={isShowTranslate}
          onShowTranslate={this.handleShowTranslate}
        />
        <ReactP5Wrapper
          sketch={sketches[selected]}
          isPlaying={isPlaying}
          isDarkMode={darkModeChecked}
          waveColor={waveColor.hex}
        />
        <ConfigMenu
          onPlayPauseSelect={this.handlePlayPauseSelect}
          isPlaying={isPlaying}
          verticalVersesChecked={isVerticalVerses}
          showSearchBarChecked={showSearchBarChecked}
          darkModeChecked={darkModeChecked}
          onDarkModeChange={this.handleDarkModeChange}
          onShowSearchBarChange={this.handleShowSearchBarChange}
          defaultPlayChecked={defaultPlayChecked}
          onDefaultPlayChange={this.handleDefaultPlayChange}
          onVerticalVersesChange={this.handleVersesLayoutChange}
          colorStayChecked={colorStayChecked}
          onColorStayChange={this.handleColorStayChange}
          selected={selected}
          onBgOptionChange={this.handleBgOptionChange}
          engineOption={engineOption}
          onEngineOptionChange={this.handleEngineOptionChange}
          fontName={fontName}
          onFontTypeChange={this.handleFontTypeChange}
          isFontLoading={isFontLoading}
          waveColor={waveColor}
          defaultDataSourceChecked={defaultDataSourceChecked}
          onDefaultDataSourceCheckedChange={this.handleDefaultDataSourceCheckedChange}
          customDataSourceUrl={customDataSourceUrl}
          onCustomDataSourceUrlChange={this.handleCustomDataSourceUrlChange}
          onCustomDataSourceUrlChangeConfirm={this.onCustomDataSourceUrlChangeConfirm}
        >
          {errMessage && (
            <div style={{ height: 30 }}>
              <InlineAlert intent="warning" marginLeft={20} marginRight={20}>
                {errMessage}
              </InlineAlert>
            </div>
          )}
        </ConfigMenu>
        {showSearchBarChecked && (
          <SearchInput
            value={value}
            focused={focused}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            engineOption={engineOption}
            isDarkMode={darkModeChecked}
          />
        )}
      </div>
    ) : null;
  }
}

export default hot(module)(App);
