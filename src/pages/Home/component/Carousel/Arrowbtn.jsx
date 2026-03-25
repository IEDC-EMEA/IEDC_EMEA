import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const usePrevNextButtons = (emblaApi) => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi) => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reinit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

export const PrevButton = (props) => {
  const { children, disabled, ...restProps } = props;

  return (
    <button
      className={"embla__button embla__button--prev".concat(
        disabled ? " embla__button--disabled" : "",
      )}
      type="button"
      disabled={disabled}
      {...restProps}
    >
      <span
        className={`z-10 rounded-full p-2 transition-colors duration-300 ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "primary-bg cursor-pointer hover:bg-emerald-600"
        }`}
      >
        <ArrowLeft color="white" />
      </span>
    </button>
  );
};

export const NextButton = (props) => {
  const { children, disabled, ...restProps } = props;

  return (
    <button
      className={"embla__button embla__button--next".concat(
        disabled ? " embla__button--disabled" : "",
      )}
      type="button"
      disabled={disabled}
      {...restProps}
    >
      <span
        className={`z-10 rounded-full p-2 transition-colors duration-300 ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "primary-bg cursor-pointer hover:bg-emerald-600"
        }`}
      >
        <ArrowRight color="white" />
      </span>
    </button>
  );
};
