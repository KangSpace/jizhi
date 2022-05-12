import React from 'react';
import { Icon } from 'evergreen-ui';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { pureWords } from '../../utils';
import DoubleClick from '../DoubleClick';

const Content = styled.div`
  font-size: calc(30px + 1vw);
  width: 80vw;
  ${(props) =>
    props.isVertical &&
    css`
      width: auto;
      line-height: 1.35;
    `};
`;

const Origin = styled.div`
  display: flex;
  margin-top: 1em;
  font-size: calc(10px + 1vw);
  justify-content: center;
  align-items: center;
  ${(props) =>
    props.isVertical &&
    css`
      margin: 0;
      margin-right: 10px;
      justify-content: flex-start;
      flex-wrap: wrap;
      word-break: keep-all;
    `};
`;

const Stamp = styled.span`
  color: #fff;
  background-color: #c20000;
  border-radius: 3px;
  padding: 3px 4px 3px 3px;
  margin: 0.5em;
  font-size: 67%;
  letter-spacing: -1px;
  ${(props) =>
    props.isVertical &&
    css`
      padding: 3px 2px 4px;
    `};
`;

const Translate = styled.div`
  display: none;
  width: 100%;
  max-height: 100px;
  overflow: auto;
  align-items: flex-start;
  justify-content: space-around;
  text-align: center;
  margin-top: 1em;
  color: #666;
  ${(props) =>
    props.isShowTranslate &&
    css`
      display: flex;
    `};
`;

const TranslateNotes = styled.div`
  color: #fff;
  background-color: #bbb;
  border-radius: 3px;
  padding: 3px 4px 3px 3px;
  margin: 0.5em;
  font-size: 67%;
  letter-spacing: -1px;
`;

const Search = styled.div`
  opacity: 0;
  transition: all 200ms ease-in;
  &:hover ${Origin} {
    opacity: 0.5;
  }
`;

const VersesContent = (props) => {
  const {
    verses: {
      content,
      origin: { author, title, translate },
    },
    engineOption,
    isVertical,
    onShowTranslate,
  } = props;

  let isShowTranslate = props.isShowTranslate;
  // 有注释时才显示
  if (isShowTranslate && (!translate || translate.length == 0)) {
    isShowTranslate = false;
  }
  const searchLink = `${engineOption}${author} ${title}`;
  const filteredContent = isVertical ? pureWords(content) : content;
  return (
    <>
      <DoubleClick doubleClick={onShowTranslate}>
        <Content isShowTranslate={isShowTranslate} isVertical={isVertical}>
          {filteredContent}
        </Content>
      </DoubleClick>
      <Origin isVertical={isVertical} on>
        <a href={searchLink} target="_blank" rel="noopener noreferrer">
          <span className="title">{`「${title}」`}</span>
        </a>
        <Stamp isVertical={isVertical}>{author}</Stamp>
        <Search>
          <Icon size={14} icon="search-text" color="black" />
        </Search>
      </Origin>
      <Translate isShowTranslate={isShowTranslate}>
        <span>{translate}</span>
        <TranslateNotes>注释</TranslateNotes>
      </Translate>
    </>
  );
};

VersesContent.propTypes = {
  verses: PropTypes.object,
  isVertical: PropTypes.bool,
  engineOption: PropTypes.string,
  fontName: PropTypes.string,
  isDarkMode: PropTypes.bool,
  translate: PropTypes.array,
  isShowTranslate: PropTypes.bool,
  onShowTranslate: PropTypes.func,
};

export default VersesContent;
