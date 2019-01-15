export interface SimpleChange<T> {
  firstChange: boolean;
  previousValue: T;
  currentValue: T;
  isFirstChange: () => boolean;
}

export function OnChange<T = any>(callback: (value: T, simpleChange?: SimpleChange<T>) => void) {
  const cachedValueKey = Symbol();
  const isFirstChangeKey = Symbol();
  return (target: any, key: PropertyKey) => {
    Object.defineProperty(target, key, {
      set: function (value) {
        // change status of "isFirstChange"
        if (this[isFirstChangeKey] === undefined) {
          this[isFirstChangeKey] = true;
        } else {
          this[isFirstChangeKey] = false;
        }
        // No operation if new value is same as old value
        if (!this[isFirstChangeKey] && this[cachedValueKey] === value) {
          return;
        }
        const oldValue = this[cachedValueKey];
        this[cachedValueKey] = value;
        const simpleChange: SimpleChange<T> = {
          firstChange: this[isFirstChangeKey],
          previousValue: oldValue,
          currentValue: this[cachedValueKey],
          isFirstChange: () => this[isFirstChangeKey],
        };
        callback.call(this, this[cachedValueKey], simpleChange);
      },
      get: function () {
        return this[cachedValueKey];
      },
    });
  };
}


// demo 1

// @OnChange<string>(function (value, simpleChange) {
//   console.log(`title is changed to: ${value}`);
//   console.log(`Other properties can also be accessed. this.foo=${this.foo} this.title=${this.title} this.count=${this.count}`);
// })
// title: string;

// demo 2

// @OnChange<number>(onCountChange)

// function onCountChange(value, simpleChange) {
//   console.log(`count is changed to: ${value}`);
//   console.log(`Other properties can also be accessed. this.foo=${this.foo} this.title=${this.title} this.count=${this.count}`);
// }
