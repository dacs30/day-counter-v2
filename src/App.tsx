import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  DatePicker,
  IDatePickerStyles,
  ITextProps,
  defaultDatePickerStrings,
  IDatePickerStrings,
  PrimaryButton,
} from '@fluentui/react';
import { useConst } from '@fluentui/react-hooks';
import { addDays } from '@fluentui/react/lib/DateTimeUtilities';
import { initializeIcons } from '@fluentui/react/lib/Icons';

initializeIcons(/* optional base url */);

const datePickerStyles: Partial<IDatePickerStyles> = { root: { maxWidth: 300, marginTop: 15 } };

function App(props: any) {
  const [maxDate, setMaxDate] = useState<Date | undefined>(undefined);
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);
  const [daysBetweenDates, setDaysBetweenDates] = useState<number | undefined>(undefined);
  const [mobileDevice, setMobileDevice] = useState<boolean | undefined>(undefined);

  const setMaxDateHandler = (date: Date | null | undefined) => {
    // set max date to date minus 1 day
    date && setMaxDate(addDays(date, -1));
  };

  const setMinDateHandler = (date: Date | null | undefined) => {
    // set min date to date plus 1 day
    date && setMinDate(addDays(date, 1));
  };

  // calculate the number of days between the two dates
  const daysBetween = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const resetCount = () => {
    setMaxDate(undefined);
    setMinDate(undefined);
    setDaysBetweenDates(undefined);
  };

  const strings: IDatePickerStrings = useConst(() => ({
    ...defaultDatePickerStrings,
    isOutOfBoundsErrorMessage: `Dates must be one after the other`,
  }));

  useEffect(() => {
    if (maxDate && minDate) {
      setDaysBetweenDates(daysBetween(addDays(maxDate, 1), addDays(minDate, -1)));
    }

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // true for mobile device
      setMobileDevice(true);
    } else {
      // false for not mobile device
      setMobileDevice(false);
    }
  }, [maxDate, minDate]);


  return (
    <div className="App">
      <header className="App-header">
        <h1>Days counter v2 📅</h1>
        <div className='subtitle'>
          <p>
            A simple app to count the number of days between two dates. The first date must be before the second date.
          </p>
        </div>
        <DatePicker
          styles={datePickerStyles}
          // DatePicker uses English strings by default. For localized apps, you must override this prop.
          placeholder="Select a date..."
          value={minDate ? addDays(minDate, -1) : undefined}
          ariaLabel="Select a date"
          maxDate={maxDate ?? undefined}
          onSelectDate={setMinDateHandler}
          {...(mobileDevice ? { allowTextInput: false } : { allowTextInput: true })} 
          strings={strings}
        />
        <DatePicker
          styles={datePickerStyles}
          // DatePicker uses English strings by default. For localized apps, you must override this prop.
          placeholder="Select a date..."
          ariaLabel="Select a date"
          value={maxDate ? addDays(maxDate, 1) : undefined}
          minDate={minDate}
          {...(mobileDevice ? { allowTextInput: false } : { allowTextInput: true })}
          onSelectDate={setMaxDateHandler}
          strings={strings}
        />
        {/* fluent ui button */}
        <div>
          <h4>
            {daysBetweenDates ? `There are ${daysBetweenDates} days between the two dates` : 0}
          </h4>
        </div>
        <PrimaryButton onClick={resetCount} text="Reset" allowDisabledFocus />
      </header>
    </div>
  );
}

export default App;
