import React, { Component } from 'react';
import $ from 'jquery';

class SelectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: this.props.placeholder
        ? this.props.placeholder
        : 'Select option',
      selectedValue: '',
      selectedId: '',
      touchPlatform: ['iphone', 'ipad', 'Android', 'linux aarch64']
    };
    this.onOptionSelect = this.onOptionSelect.bind(this);
  }

  componentDidMount() {
    var $container = $('.mydropdown-menu'),
      $list = $('.mydropdown-menu ul'),
      listItem = $list.find('li');

    // $('.mydropdown .title').click(function (e) {
    $('.mydropdown .title').on('click', function(e) {
      if ($(e.currentTarget).attr('aria-expanded') === 'true') {
        closeMenu(this);
      } else {
        openMenu(this);
      }
    });

    // $('.mydropdown-menu li').on('click', function () {
    // closeMenu(this);
    // $(this)
    // .closest('.mydropdown')
    // .find('.title')
    // .text($(this).text());
    // });

    // $('.mydropdown-menu li').on('tap', function () {
    // closeMenu(this);
    // $(this)
    // .closest('.mydropdown')
    // .find('.title')
    // .text($(this).text());
    // });

    function closeMenu(el) {
      $(el)
        .closest('.mydropdown')
        .addClass('closed');
      // .removeClass('open')
      // .find('.title')
      // .text($(el).text());
      $container.css('height', 0);
      $list.css('top', 0);
    }

    function openMenu(el) {
      $(el)
        .parent()
        .removeClass('closed');
      // .addClass('open');

      function mouseMove(e) {
        e.preventDefault();

        try {
          var heightDiff = $list.height() / $container.height(),
            offset = $container.offset(),
            pageY = e.pageY || e.targetTouches[0].pageY,
            relativeY = pageY - offset.top,
            top =
              relativeY * heightDiff > $list.height() - $container.height()
                ? $list.height() - $container.height()
                : relativeY * heightDiff;
          if (top > 0) $list.css('top', -top);
        } catch (err) {
          console.log(err);
        }
      }

      $container
        .css({
          height: 200
        })
        .on('mousemove touchmove', mouseMove);
      // .mousemove(mouseMove);

      // $container
      //   .css({
      //     height: 200
      //   })
      //   .mousemove(mouseMove);
      // $container
      //   .touchmove(mouseMove);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && this.props.value !== nextProps.value) {
      this.setState({
        selectedId: nextProps.value
      });
      const newId = nextProps.value;
      const data = this.props.data;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.value === newId) {
          this.setState({
            selectedValue: element.label
          });
          break;
        }
      }
    }

    if (nextProps.value === '') {
      this.setState({
        selectedId: '',
        selectedValue: ''
      });
    }

    if (nextProps.open !== this.props.open)
      if (nextProps.open === true) {
        $('.mydropdown .title').trigger('click');
      } else if (nextProps.open === false) {
        $('.mydropdown-menu li').trigger('click');
      }
  }

  onOptionSelect(item) {
    const callBackParameter = item;
    if (this.props.onSelect && typeof this.props.onSelect === 'function') {
      this.props.onSelect(callBackParameter);
    }
    if (this.props.onChange && typeof this.props.onChange === 'function') {
      this.props.onChange(callBackParameter);
    }
    this.setState({
      selectedId: callBackParameter.value,
      selectedValue: callBackParameter.label
    });
  }

  render() {
    const selectedValue = this.state.selectedValue
      ? this.state.selectedValue
      : this.state.placeholder;
    const data = this.props.data || [];
    let _this = this;
    const touchPlatform = this.state.touchPlatform;
    return (
      <div className="dropdown mydropdown closed">
        <div className="title" data-toggle="dropdown">
          {selectedValue}
        </div>
        <div className="dropdown-menu mydropdown-menu">
          <ul>
            {data.map(function(item, index) {
              return [
                <li
                  id={item.value}
                  onTouchEndCapture={() => {
                    _this.onOptionSelect(item);
                  }}
                  onTouchStart={() => {
                    _this.onOptionSelect(item);
                  }}
                  key={index}
                  className={
                    touchPlatform.indexOf(navigator.platform.toLowerCase()) !==
                    -1
                      ? ''
                      : 'hide'
                  }
                >
                  {item.label}
                </li>,
                <li
                  id={item.value}
                  onClick={() => {
                    _this.onOptionSelect(item);
                  }}
                  key={item.value}
                  className={
                    touchPlatform.indexOf(navigator.platform.toLowerCase()) !==
                    -1
                      ? 'hide'
                      : ''
                  }
                >
                  {item.label}
                </li>
              ];
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default SelectionList;
