import React from "react";
import DatePicker from "../src/index.jsx";
import TestUtils from "react-dom/test-utils";
import { findDOMNode } from "react-dom";
import { createRoot } from "react-dom/client";
import Time from "../src/time";
import { newDate, formatDate } from "../src/date_utils";

import { getKey } from "./test_utils";

describe("TimePicker", () => {
  let datePicker;
  let div;
  let onChangeMoment;

  beforeEach(() => {
    div = document.createElement("div");
  });

  it("should update on input time change", () => {
    renderDatePicker("February 28, 2018 4:43 PM");
    expect(getInputString()).to.equal("February 28, 2018 4:43 PM");

    setManually("February 28, 2018 4:45 PM");
    expect(formatDate(onChangeMoment, "MMMM d, yyyy p")).to.equal(
      "February 28, 2018 4:45 PM",
    );
  });

  it("should allow time changes after input change", () => {
    renderDatePicker("February 28, 2018 4:43 PM");
    setManually("February 28, 2018 4:45 PM");
    TestUtils.Simulate.focus(findDOMNode(datePicker.input));
    const time = TestUtils.findRenderedComponentWithType(datePicker, Time);
    const lis = TestUtils.scryRenderedDOMComponentsWithTag(time, "li");
    TestUtils.Simulate.click(lis[1]);
    expect(getInputString()).to.equal("February 28, 2018 12:30 AM");
  });

  it("should allow for injected date if input does not have focus", () => {
    renderDatePicker("February 28, 2018 4:43 PM");
    setManually("February 28, 2018 4:45 PM");
    TestUtils.Simulate.blur(datePicker.input);
    renderDatePicker("February 28, 2018 4:43 PM");
    expect(getInputString()).to.equal("February 28, 2018 4:43 PM");
  });

  it("should not close datepicker after time clicked when shouldCloseOnSelect is false", () => {
    var datePicker = TestUtils.renderIntoDocument(
      <DatePicker shouldCloseOnSelect={false} showTimeSelect />,
    );
    var dateInput = datePicker.input;
    TestUtils.Simulate.focus(findDOMNode(dateInput));
    const time = TestUtils.findRenderedComponentWithType(datePicker, Time);
    const lis = TestUtils.scryRenderedDOMComponentsWithTag(time, "li");
    TestUtils.Simulate.click(lis[0]);
    expect(datePicker.state.open).to.be.true;
  });

  it("should show different colors for times", () => {
    const handleTimeColors = (time, currH, currM) => {
      if (!Number.isInteger(currH) || !Number.isInteger(currM)) {
        return "wrong";
      }
      return time.getHours() < 12 ? "red" : "green";
    };
    const timePicker = TestUtils.renderIntoDocument(
      <DatePicker
        showTimeSelect
        showTimeSelectOnly
        timeClassName={handleTimeColors}
        open
        focus
      />,
    );
    let redItems = TestUtils.scryRenderedDOMComponentsWithClass(
      timePicker,
      "react-datepicker__time-list-item red",
    );
    let greenItems = TestUtils.scryRenderedDOMComponentsWithClass(
      timePicker,
      "react-datepicker__time-list-item green",
    );
    assert.isTrue(
      redItems !== undefined &&
        redItems.length === 24 &&
        greenItems !== undefined &&
        greenItems.length === 24,
    );
  });

  it("should handle 40 min time intervals", () => {
    renderDatePicker("February 28, 2018 9:00 AM", {
      timeIntervals: 40,
      showTimeSelect: true,
    });
    expect(getInputString()).to.equal("February 28, 2018 9:00 AM");

    findDOMNode(datePicker.input).focus();

    setManually("February 28, 2018 9:20 AM");
    expect(getInputString()).to.equal("February 28, 2018 9:20 AM");
  });

  it("should handle 53 min time intervals", () => {
    renderDatePicker("February 28, 2018 9:00 AM", {
      timeIntervals: 53,
      showTimeSelect: true,
    });
    expect(getInputString()).to.equal("February 28, 2018 9:00 AM");

    findDOMNode(datePicker.input).focus();

    setManually("February 28, 2018 9:53 AM");
    expect(getInputString()).to.equal("February 28, 2018 9:53 AM");
  });

  it("should handle 90 min time intervals", () => {
    renderDatePicker("July 13, 2020 2:59 PM", {
      timeIntervals: 90,
      showTimeSelect: true,
    });
    expect(getInputString()).to.equal("July 13, 2020 2:59 PM");

    findDOMNode(datePicker.input).focus();

    setManually("July 13, 2020 3:00 PM");
    expect(getInputString()).to.equal("July 13, 2020 3:00 PM");
  });

  it("should not contain the time only classname in header by default", () => {
    const timePicker = TestUtils.renderIntoDocument(
      <DatePicker open showTimeSelect />,
    );
    const header = TestUtils.scryRenderedDOMComponentsWithClass(
      timePicker,
      "react-datepicker__header--time--only",
    );
    expect(header).to.have.length(0);
  });

  it("should contain the time only classname in header if enabled", () => {
    const timePicker = TestUtils.renderIntoDocument(
      <DatePicker open showTimeSelect showTimeSelectOnly />,
    );
    const header = TestUtils.scryRenderedDOMComponentsWithClass(
      timePicker,
      "react-datepicker__header--time--only",
    );
    expect(header).to.have.length(1);
  });

  it("should select time when Enter is pressed", () => {
    renderDatePicker("February 28, 2018 4:43 PM");
    TestUtils.Simulate.focus(findDOMNode(datePicker.input));
    const time = TestUtils.findRenderedComponentWithType(datePicker, Time);
    const lis = TestUtils.scryRenderedDOMComponentsWithTag(time, "li");
    TestUtils.Simulate.keyDown(lis[1], getKey("Enter"));
    expect(getInputString()).to.equal("February 28, 2018 12:30 AM");
  });

  it("should select time when Space is pressed", () => {
    renderDatePicker("February 28, 2018 4:43 PM");
    TestUtils.Simulate.focus(findDOMNode(datePicker.input));
    const time = TestUtils.findRenderedComponentWithType(datePicker, Time);
    const lis = TestUtils.scryRenderedDOMComponentsWithTag(time, "li");
    TestUtils.Simulate.keyDown(lis[1], getKey(" "));
    expect(getInputString()).to.equal("February 28, 2018 12:30 AM");
  });

  it("should not select time when Escape is pressed", () => {
    renderDatePicker("February 28, 2018 4:43 PM");
    TestUtils.Simulate.focus(findDOMNode(datePicker.input));
    const time = TestUtils.findRenderedComponentWithType(datePicker, Time);
    const lis = TestUtils.scryRenderedDOMComponentsWithTag(time, "li");
    TestUtils.Simulate.keyDown(lis[1], getKey("Escape"));
    expect(getInputString()).to.equal("February 28, 2018 4:43 PM");
  });

  it("should call the onKeyDown handler on key Escape press", () => {
    const onKeyDownSpy = sinon.spy();
    renderDatePicker("February 28, 2018 4:43 PM", {
      onKeyDown: onKeyDownSpy,
    });
    TestUtils.Simulate.focus(findDOMNode(datePicker.input));
    const time = TestUtils.findRenderedComponentWithType(datePicker, Time);
    const lis = TestUtils.scryRenderedDOMComponentsWithTag(time, "li");
    TestUtils.Simulate.keyDown(lis[1], getKey("Escape"));
    expect(onKeyDownSpy.calledOnce).to.be.true;
  });

  it("should call the onKeyDown handler on key Enter press", () => {
    const onKeyDownSpy = sinon.spy();
    renderDatePicker("February 28, 2018 4:43 PM", {
      onKeyDown: onKeyDownSpy,
    });
    TestUtils.Simulate.focus(findDOMNode(datePicker.input));
    const time = TestUtils.findRenderedComponentWithType(datePicker, Time);
    const lis = TestUtils.scryRenderedDOMComponentsWithTag(time, "li");
    TestUtils.Simulate.keyDown(lis[1], getKey("Enter"));
    expect(onKeyDownSpy.calledOnce).to.be.true;
  });

  it("should call the onKeyDown handler on key Space press", () => {
    const onKeyDownSpy = sinon.spy();
    renderDatePicker("February 28, 2018 4:43 PM", {
      onKeyDown: onKeyDownSpy,
    });
    TestUtils.Simulate.focus(findDOMNode(datePicker.input));
    const time = TestUtils.findRenderedComponentWithType(datePicker, Time);
    const lis = TestUtils.scryRenderedDOMComponentsWithTag(time, "li");
    TestUtils.Simulate.keyDown(lis[1], getKey(" "));
    expect(onKeyDownSpy.calledOnce).to.be.true;
  });

  function setManually(string) {
    TestUtils.Simulate.focus(datePicker.input);
    TestUtils.Simulate.change(datePicker.input, { target: { value: string } });
  }

  function getInputString() {
    return findDOMNode(datePicker.input).value;
  }

  function renderDatePicker(string, props) {
    return renderDatePickerFor(new Date(string), props);
  }

  function renderDatePickerFor(selected, props) {
    const root = createRoot(div);

    datePicker = root.render(
      <DatePicker
        selected={selected}
        dateFormat={"MMMM d, yyyy p"}
        allowSameDay
        onChange={onChange}
        showTimeSelect
        {...props}
      />,
    );
  }

  function onChange(m) {
    onChangeMoment = newDate(m);
    renderDatePicker(m);
  }
});
