import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  InfoSignIcon,
  InlineAlert,
  Menu,
  Pane,
  Position,
  SegmentedControl,
  SidebarTab,
  Spinner,
  Switch,
  Tablist,
  Text,
  TextInput,
  TickIcon,
  Tooltip,
} from 'evergreen-ui';
import styled from 'styled-components';
import { WAVES } from '../../constants/appConstants';
import Legal from './Legal';
import FontStatement from './FontStatement';
import SaveBgMenuItem from './SaveBgMenuItem';

const SwitchWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SegmentedControlWrapper = styled.div`
  margin: 16px;
`;

const MenuContent = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    isPlaying,
    onPlayPauseSelect,
    showSearchBarChecked,
    onShowSearchBarChange,
    defaultPlayChecked,
    verticalVersesChecked,
    onVerticalVersesChange,
    onDefaultPlayChange,
    colorStayChecked,
    onColorStayChange,
    selected,
    onBgOptionChange,
    engineOption,
    onEngineOptionChange,
    fontName,
    onFontTypeChange,
    darkModeChecked,
    onDarkModeChange,
    isFontLoading,
    waveColor,
    /**
     * 默认数据源开关
     */
    defaultDataSourceChecked,
    /**
     * 默认数据源开关切换事件
     */
    onDefaultDataSourceCheckedChange,
    /**
     * 自定义数据源路径
     */
    customDataSourceUrl,
    /**
     * 自定义数据源路径路径修改事件
     */
    onCustomDataSourceUrlChange,
    onCustomDataSourceUrlChangeConfirm,
  } = props;

  /**
   * 自定义数据源数据格式描述
   * @type {string}
   */
  const customDataSourceDataFormatDesc = `
1. 按固定格式提供的数据源JSON文件,
2. JSON文件内容应按以下格式提供: 
{
  "tags":"内容的tag分类, 如: 孙子兵法, 素书, 滕王阁序",
  "status": "数据状态,固定值为:success",
  "data": [{
    "content": "单个词句内容",
    "origin": {
      "title": "词句来源标题,如古诗的标题",
      "dynasty": "词句来源朝代,如古诗的朝代",
      "author": "词句的作者",
      "content": [
        "词句所在文章的完整内容"
      ],
      "translate": [
        "词句的翻译"
      ]
    }
  }
 ]
}
    `;

  const bgOptions = [
    { label: 'Waves', value: 'waves' },
    { label: 'Blobs', value: 'blobs' },
  ];

  const engineOptions = [
    {
      label: 'Google',
      value: 'https://www.google.com/search?q=',
    },
    { label: 'Baidu', value: 'https://www.baidu.com/s?wd=' },
    {
      label: 'Bing',
      value: 'https://www.bing.com/search?q=',
    },
  ];

  const fontOptions = [
    { label: '江西拙楷', value: 'JXZhuoKai' },
    { label: '欣意吉祥宋', value: 'JiXiangSong' },
    { label: '方正细金陵', value: 'FZXiJinLJW' },
  ];

  const switchOptions = [
    {
      name: '黑夜模式',
      checkedState: darkModeChecked,
      onChangeFunc: onDarkModeChange,
    },
    {
      name: '竖版诗词',
      checkedState: verticalVersesChecked,
      onChangeFunc: onVerticalVersesChange,
    },
    {
      name: '默认播放动画',
      checkedState: defaultPlayChecked,
      onChangeFunc: onDefaultPlayChange,
    },
    {
      name: '显示搜索框',
      checkedState: showSearchBarChecked,
      onChangeFunc: onShowSearchBarChange,
    },
    {
      name: '保留颜色名称',
      checkedState: colorStayChecked,
      onChangeFunc: onColorStayChange,
    },
  ];

  /**
   * 数据源设置
   * @type {*[]}
   */
  const dataSourceOptions = {
    default: {
      name: 'default',
      desc: '今日诗词(默认)',
      show: true,
      checked: defaultDataSourceChecked,
      onChangeFunc: onDefaultDataSourceCheckedChange,
    },
    custom: {
      name: 'custom',
      desc: '自定义',
      value: customDataSourceUrl,
      show: !defaultDataSourceChecked,
      onChangeFunc: onCustomDataSourceUrlChange,
    },
  };

  const tabs = [
    {
      tabName: '设置',
      tabContent: (
        <>
          <Menu.Group title="偏好">
            {switchOptions.map((option) => {
              if (selected !== WAVES && option.name === '保留颜色名称') return;
              return (
                <Menu.Item key={option.name}>
                  <SwitchWrapper>
                    {option.name}
                    <Switch checked={option.checkedState} onChange={option.onChangeFunc} />
                  </SwitchWrapper>
                </Menu.Item>
              );
            })}
          </Menu.Group>
          <Menu.Divider />

          <Menu.Group title="搜索引擎">
            <SegmentedControlWrapper>
              <SegmentedControl
                width={280}
                options={engineOptions}
                value={engineOption}
                onChange={onEngineOptionChange}
              />
            </SegmentedControlWrapper>
          </Menu.Group>
        </>
      ),
    },
    {
      tabName: '背景',
      tabContent: (
        <Menu.OptionsGroup options={bgOptions} selected={selected} onChange={onBgOptionChange} />
      ),
    },
    {
      tabName: '操作',
      tabContent: (
        <Menu.Group>
          <SaveBgMenuItem />
          <Menu.Item
            icon={isPlaying ? 'pause' : 'play'}
            intent="success"
            onSelect={onPlayPauseSelect}
            secondaryText="Space"
          >
            {isPlaying ? '暂停动画' : '播放动画'}
          </Menu.Item>
          <InlineAlert intent="none" marginRight={15} marginLeft={15}>
            <p>波纹背景下使用左右键可以随机切换颜色</p>
          </InlineAlert>
        </Menu.Group>
      ),
    },

    {
      tabName: '字体',
      tabContent: (
        <Menu.Group title="选择字体">
          <SegmentedControlWrapper>
            <SegmentedControl
              width={280}
              options={fontOptions}
              value={fontName}
              onChange={onFontTypeChange}
            />
            {isFontLoading ? (
              <Pane height={30} width={280} marginBottom={-10} marginTop={10} display="flex">
                <Spinner size={20} marginRight={5} />
                <Text>远程加载中……</Text>
              </Pane>
            ) : (
              <FontStatement fontName={fontName} />
            )}
          </SegmentedControlWrapper>
        </Menu.Group>
      ),
    },
    {
      tabName: '数据源',
      tabContent: (
        <>
          <Menu.Group title="设置数据源">
            <Menu.Item key={dataSourceOptions.default.name}>
              <SwitchWrapper>
                {dataSourceOptions.default.desc}
                <Switch
                  checked={dataSourceOptions.default.checked}
                  onChange={dataSourceOptions.default.onChangeFunc}
                />
              </SwitchWrapper>
            </Menu.Item>
          </Menu.Group>
          <Menu.Divider />
          {dataSourceOptions.custom.show ? (
            <Menu.Group
              title={
                <>
                  <Pane display="flex" width={300}>
                    <Text>自定义</Text>
                    <Tooltip
                      content={
                        <>
                          <pre>
                            <code>{customDataSourceDataFormatDesc}</code>
                          </pre>
                        </>
                      }
                      position={Position.TOP}
                      appearance="card"
                    >
                      <InfoSignIcon />
                    </Tooltip>
                  </Pane>
                </>
              }
            >
              <Pane paddingLeft={16} paddingRight={0} display="flex">
                <TextInput
                  name="custom-datasource-url-input-name"
                  placeholder="输入数据源JSON文件地址..."
                  title={customDataSourceUrl}
                  value={customDataSourceUrl}
                  onChange={(e) => {
                    onCustomDataSourceUrlChange(e.target.value);
                  }}
                />
                <Tooltip content="保存" position={Position.TOP}>
                  <IconButton
                    icon={TickIcon}
                    intent="success"
                    marginLeft={5}
                    onClick={(e) => onCustomDataSourceUrlChangeConfirm(e)}
                  />
                </Tooltip>
              </Pane>
              <Pane display="flex" paddingLeft={16} width={300}>
                <a href="https://edit.kangspace.org" target="_blank" rel="noopener noreferrer">
                  <Text size={300}>{`编辑: https://edit.kangspace.org`}</Text>
                </a>
              </Pane>
            </Menu.Group>
          ) : (
            ''
          )}
        </>
      ),
    },
    { tabName: '关于', tabContent: <Legal waveColor={waveColor} selected={selected} /> },
  ];

  return (
    <Pane display="flex" height={300}>
      <Tablist width={80} margin={10}>
        {tabs.map(({ tabName }, index) => (
          <SidebarTab
            key={tabName}
            id={tabName}
            onSelect={() => setSelectedIndex(index)}
            isSelected={index === selectedIndex}
            aria-controls={`panel-${tabName}`}
          >
            {tabName}
          </SidebarTab>
        ))}
      </Tablist>
      <Pane width={350} background="tint1">
        {tabs.map(({ tabName, tabContent }, index) => (
          <Pane
            key={tabName}
            id={`panel-${tabName}`}
            role="tabpanel"
            aria-labelledby={tabName}
            aria-hidden={index !== selectedIndex}
            display={index === selectedIndex ? 'block' : 'none'}
          >
            {tabContent}
          </Pane>
        ))}
      </Pane>
    </Pane>
  );
};

MenuContent.propTypes = {
  children: PropTypes.any,
  showSearchBarChecked: PropTypes.bool,
  onShowSearchBarChange: PropTypes.func,
  darkModeChecked: PropTypes.bool,
  onDarkModeChange: PropTypes.func,
  onPlayPauseSelect: PropTypes.func.isRequired,
  onVerticalVersesChange: PropTypes.func.isRequired,
  verticalVersesChecked: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  defaultPlayChecked: PropTypes.bool.isRequired,
  onDefaultPlayChange: PropTypes.func.isRequired,
  colorStayChecked: PropTypes.bool.isRequired,
  onColorStayChange: PropTypes.func.isRequired,
  selected: PropTypes.string,
  onBgOptionChange: PropTypes.func,
  engineOption: PropTypes.string,
  onEngineOptionChange: PropTypes.func,
  fontName: PropTypes.string,
  onFontTypeChange: PropTypes.func,
  isFontLoading: PropTypes.bool,
  waveColor: PropTypes.object,
  defaultDataSourceChecked: PropTypes.bool,
  onDefaultDataSourceCheckedChange: PropTypes.func,
  customDataSourceUrl: PropTypes.string,
  onCustomDataSourceUrlChange: PropTypes.func,
  onCustomDataSourceUrlChangeConfirm: PropTypes.func,
};

export default MenuContent;
