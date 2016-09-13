import { expect } from 'chai';
import multiSplice from '../src';

describe('Fast Splice', () => {
  let array;
  let comparisonArray;
  let gets;
  let sets;

  function enableProxy() {
    gets = Object.create(null);
    sets = Object.create(null);
  }
  function disableProxy() {
    gets = sets = null;
  }

  const proxiedArray = (function proxiedArray() {
    const proxyHandler = {
      get: function get(target, property) {
        // Allow two gets, one for the splice and one for the deep equals.
        if (gets) {
          if (gets[property]) {
            throw new Error(`got ${property} multiple times`);
          }
          gets[property] = true;
        }
        return target[property];
      },

      set: function set(target, property, value) {
        // Allow two sets, one for the splice and one for the deep equals.
        if (sets) {
          if (sets[property]) {
            throw new Error(`set ${property} multiple times`);
          }
          sets[property] = true;
        }
        target[property] = value;
        return true;
      },
    };

    return function proxiedArray(array) {
      if (typeof Proxy === 'undefined') {
        return array;
      }

      return new Proxy(array, proxyHandler);
    };
  }());

  beforeEach(() => {
    array = proxiedArray([1, 2, 3, 4, 5]);
    comparisonArray = [1, 2, 3, 4, 5];
    disableProxy();
  });

  function splice(...args) {
    enableProxy();
    const ret = multiSplice.apply(this, args);
    disableProxy();
    return ret;
  }
  function nativeSplice(arr, ...args) {
    if (args.length === 3) {
      args.push(...args.pop());
    }
    return arr.splice.apply(arr, args);
  }

  describe('with no arguments', () => {
    it('errors', () => {
      expect(() => {
        splice();
      }).to.throw(TypeError);
      expect(() => {
        nativeSplice();
      }).to.throw(TypeError);
    });
  });

  describe('with only array argument', () => {
    it('leaves array untouched', () => {
      splice(array);
      nativeSplice(comparisonArray);
      expect(array).to.deep.equal(comparisonArray);
    });

    it('returns empty array', () => {
      expect(splice(array))
        .to.deep.equal(nativeSplice(comparisonArray));
    });
  });

  describe('with start index', () => {
    describe('with 0 start index', () => {
      it('removes everything after index', () => {
        splice(array, 0);
        nativeSplice(comparisonArray, 0);
        expect(array).to.deep.equal(comparisonArray);
      });

      it('returns removed elements', () => {
        expect(splice(array, 0))
          .to.deep.equal(nativeSplice(comparisonArray, 0));
      });
    });

    describe('with middle start index', () => {
      it('removes everything after index', () => {
        splice(array, 3);
        nativeSplice(comparisonArray, 3);
        expect(array).to.deep.equal(comparisonArray);
      });

      it('returns removed elements', () => {
        expect(splice(array, 3))
          .to.deep.equal(nativeSplice(comparisonArray, 3));
      });
    });

    describe('with high start index', () => {
      it('removes nothing', () => {
        splice(array, array.length + 1);
        nativeSplice(comparisonArray, comparisonArray.length + 1);
        expect(array).to.deep.equal(comparisonArray);
      });

      it('returns empty array', () => {
        expect(splice(array, array.length + 1))
          .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1));
      });
    });

    describe('with negative start index', () => {
      it('removes count from the end', () => {
        splice(array, -1);
        nativeSplice(comparisonArray, -1);
        expect(array).to.deep.equal(comparisonArray);
      });

      it('returns removed elements', () => {
        expect(splice(array, -1))
          .to.deep.equal(nativeSplice(comparisonArray, -1));
      });
    });

    describe('with very negative start index', () => {
      it('removes everything', () => {
        splice(array, -array.length - 1);
        nativeSplice(comparisonArray, -comparisonArray.length - 1);
        expect(array).to.deep.equal(comparisonArray);
      });

      it('returns everything', () => {
        expect(splice(array, -array.length - 1))
          .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1));
      });
    });

    describe('with odd start index', () => {
      it('removes everything', () => {
        splice(array, null);
        nativeSplice(comparisonArray, null);
        expect(array).to.deep.equal(comparisonArray);
      });

      it('returns everything', () => {
        expect(splice(array, null))
          .to.deep.equal(nativeSplice(comparisonArray, null));
      });
    });
  });

  describe('with delete count', () => {
    describe('with 0 delete count', () => {
      describe('with 0 start index', () => {
        it('removes nothing', () => {
          splice(array, 0, 0);
          nativeSplice(comparisonArray, 0, 0);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, 0, 0))
            .to.deep.equal(nativeSplice(comparisonArray, 0, 0));
        });
      });

      describe('with middle start index', () => {
        it('removes nothing', () => {
          splice(array, 3, 0);
          nativeSplice(comparisonArray, 3, 0);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, 3, 0))
            .to.deep.equal(nativeSplice(comparisonArray, 3, 0));
        });
      });

      describe('with high start index', () => {
        it('removes nothing', () => {
          splice(array, array.length + 1, 0);
          nativeSplice(comparisonArray, comparisonArray.length + 1, 0);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, array.length + 1, 0))
            .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, 0));
        });
      });

      describe('with negative start index', () => {
        it('removes nothing', () => {
          splice(array, -1, 0);
          nativeSplice(comparisonArray, -1, 0);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, -1, 0))
            .to.deep.equal(nativeSplice(comparisonArray, -1, 0));
        });
      });

      describe('with very negative start index', () => {
        it('removes nothing', () => {
          splice(array, -array.length - 1, 0);
          nativeSplice(comparisonArray, -comparisonArray.length - 1, 0);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, -array.length - 1, 0))
            .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, 0));
        });
      });

      describe('with odd start index', () => {
        it('removes nothing', () => {
          splice(array, null, 0);
          nativeSplice(comparisonArray, null, 0);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, null, 0))
            .to.deep.equal(nativeSplice(comparisonArray, null, 0));
        });
      });
    });

    describe('with middle delete count', () => {
      describe('with 0 start index', () => {
        it('removes count elements', () => {
          splice(array, 0, 2);
          nativeSplice(comparisonArray, 0, 2);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns removed elements', () => {
          expect(splice(array, 0, 2))
            .to.deep.equal(nativeSplice(comparisonArray, 0, 2));
        });
      });

      describe('with middle start index', () => {
        it('removes count elements', () => {
          splice(array, 4, 2);
          nativeSplice(comparisonArray, 4, 2);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns removed elements', () => {
          expect(splice(array, 4, 2))
            .to.deep.equal(nativeSplice(comparisonArray, 4, 2));
        });
      });

      describe('with high start index', () => {
        it('removes nothing', () => {
          splice(array, array.length + 1, 2);
          nativeSplice(comparisonArray, comparisonArray.length + 1, 2);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns removed elements', () => {
          expect(splice(array, array.length + 1, 2))
            .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, 2));
        });
      });

      describe('with negative start index', () => {
        it('removes count elements', () => {
          splice(array, -1, 2);
          nativeSplice(comparisonArray, -1, 2);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns removed elements', () => {
          expect(splice(array, -1, 2))
            .to.deep.equal(nativeSplice(comparisonArray, -1, 2));
        });
      });

      describe('with very negative start index', () => {
        it('removes count elements', () => {
          splice(array, -array.length - 1, 2);
          nativeSplice(comparisonArray, -comparisonArray.length - 1, 2);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns removed elements', () => {
          expect(splice(array, -array.length - 1, 2))
            .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, 2));
        });
      });

      describe('with odd start index', () => {
        it('removes count elements', () => {
          splice(array, null, 2);
          nativeSplice(comparisonArray, null, 2);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns removed elements', () => {
          expect(splice(array, null, 2))
            .to.deep.equal(nativeSplice(comparisonArray, null, 2));
        });
      });
    });

    describe('with high delete count', () => {
      describe('with 0 start index', () => {
        it('removes everything', () => {
          splice(array, 0, array.length);
          nativeSplice(comparisonArray, 0, comparisonArray.length);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns everything', () => {
          expect(splice(array, 0, array.length))
            .to.deep.equal(nativeSplice(comparisonArray, 0, comparisonArray.length));
        });
      });

      describe('with middle start index', () => {
        it('removes everything after start index', () => {
          splice(array, 3, array.length);
          nativeSplice(comparisonArray, 3, comparisonArray.length);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns removed elements', () => {
          expect(splice(array, 3, array.length))
            .to.deep.equal(nativeSplice(comparisonArray, 3, comparisonArray.length));
        });
      });

      describe('with high start index', () => {
        it('removes nothing', () => {
          splice(array, array.length + 1, array.length);
          nativeSplice(comparisonArray, comparisonArray.length + 1, comparisonArray.length);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, array.length + 1, array.length))
            .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, comparisonArray.length));
        });
      });

      describe('with negative start index', () => {
        it('removes everything after count from end', () => {
          splice(array, -1, array.length);
          nativeSplice(comparisonArray, -1, comparisonArray.length);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns removed elements', () => {
          expect(splice(array, -1, array.length))
            .to.deep.equal(nativeSplice(comparisonArray, -1, comparisonArray.length));
        });
      });

      describe('with very negative start index', () => {
        it('removes everything', () => {
          splice(array, -array.length - 1, array.length);
          nativeSplice(comparisonArray, -comparisonArray.length - 1, comparisonArray.length);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns everything', () => {
          expect(splice(array, -array.length - 1, array.length))
            .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, comparisonArray.length));
        });
      });

      describe('with odd start index', () => {
        it('removes everything', () => {
          splice(array, null, array.length);
          nativeSplice(comparisonArray, null, comparisonArray.length);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns everything', () => {
          expect(splice(array, null, array.length))
            .to.deep.equal(nativeSplice(comparisonArray, null, comparisonArray.length));
        });
      });
    });

    describe('with negative delete count', () => {
      describe('with 0 start index', () => {
        it('removes nothing', () => {
          splice(array, 0, -1);
          nativeSplice(comparisonArray, 0, -1);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, 0, -1))
            .to.deep.equal(nativeSplice(comparisonArray, 0, -1));
        });
      });

      describe('with middle start index', () => {
        it('removes nothing', () => {
          splice(array, 3, -1);
          nativeSplice(comparisonArray, 3, -1);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, 3, -1))
            .to.deep.equal(nativeSplice(comparisonArray, 3, -1));
        });
      });

      describe('with high start index', () => {
        it('removes nothing', () => {
          splice(array, array.length + 1, -1);
          nativeSplice(comparisonArray, comparisonArray.length + 1, -1);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, array.length + 1, -1))
            .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, -1));
        });
      });

      describe('with negative start index', () => {
        it('removes nothing', () => {
          splice(array, -1, -1);
          nativeSplice(comparisonArray, -1, -1);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, -1, -1))
            .to.deep.equal(nativeSplice(comparisonArray, -1, -1));
        });
      });

      describe('with very negative start index', () => {
        it('removes nothing', () => {
          splice(array, -array.length - 1, -1);
          nativeSplice(comparisonArray, -comparisonArray.length - 1, -1);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, -array.length - 1, -1))
            .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, -1));
        });
      });

      describe('with odd start index', () => {
        it('removes nothing', () => {
          splice(array, null, -1);
          nativeSplice(comparisonArray, null, -1);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, null, -1))
            .to.deep.equal(nativeSplice(comparisonArray, null, -1));
        });
      });
    });

    describe('with odd delete count', () => {
      describe('with 0 start index', () => {
        it('removes nothing', () => {
          splice(array, 0, null);
          nativeSplice(comparisonArray, 0, null);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, 0, null))
            .to.deep.equal(nativeSplice(comparisonArray, 0, null));
        });
      });

      describe('with middle start index', () => {
        it('removes nothing', () => {
          splice(array, 3, null);
          nativeSplice(comparisonArray, 3, null);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, 3, -1))
            .to.deep.equal(nativeSplice(comparisonArray, 3, -1));
        });
      });

      describe('with high start index', () => {
        it('removes nothing', () => {
          splice(array, array.length + 1, null);
          nativeSplice(comparisonArray, comparisonArray.length + 1, null);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, array.length + 1, null))
            .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, null));
        });
      });

      describe('with negative start index', () => {
        it('removes nothing', () => {
          splice(array, -1, null);
          nativeSplice(comparisonArray, -1, null);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, -1, null))
            .to.deep.equal(nativeSplice(comparisonArray, -1, null));
        });
      });

      describe('with very negative start index', () => {
        it('removes nothing', () => {
          splice(array, -array.length - 1, null);
          nativeSplice(comparisonArray, -comparisonArray.length - 1, null);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, -array.length - 1, null))
            .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, null));
        });
      });

      describe('with odd start index', () => {
        it('removes nothing', () => {
          splice(array, null, null);
          nativeSplice(comparisonArray, null, null);
          expect(array).to.deep.equal(comparisonArray);
        });

        it('returns empty array', () => {
          expect(splice(array, null, null))
            .to.deep.equal(nativeSplice(comparisonArray, null, null));
        });
      });
    });
  });

  describe('with insert array', () => {
    describe('with 0 insert count', () => {
      describe('with 0 delete count', () => {
        describe('with 0 start index', () => {
          it('does not alter array', () => {
            splice(array, 0, 0, []);
            nativeSplice(comparisonArray, 0, 0, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 0, 0, []))
              .to.deep.equal(nativeSplice(comparisonArray, 0, 0, []));
          });
        });

        describe('with middle start index', () => {
          it('does not alter array', () => {
            splice(array, 3, 0, []);
            nativeSplice(comparisonArray, 3, 0, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 3, 0, []))
              .to.deep.equal(nativeSplice(comparisonArray, 3, 0, []));
          });
        });

        describe('with high start index', () => {
          it('does not alter array', () => {
            splice(array, array.length + 1, 0, []);
            nativeSplice(comparisonArray, comparisonArray.length + 1, 0, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, 0, []))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, 0, []));
          });
        });

        describe('with negative start index', () => {
          it('does not alter array', () => {
            splice(array, -2, 0, []);
            nativeSplice(comparisonArray, -2, 0, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -2, 0, []))
              .to.deep.equal(nativeSplice(comparisonArray, -2, 0, []));
          });
        });

        describe('with very negative start index', () => {
          it('does not alter array', () => {
            splice(array, -array.length - 1, 0, []);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, 0, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -array.length - 1, 0, []))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, 0, []));
          });
        });

        describe('with odd start index', () => {
          it('does not alter array', () => {
            splice(array, null, 0, []);
            nativeSplice(comparisonArray, null, 0, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, null, 0, []))
              .to.deep.equal(nativeSplice(comparisonArray, null, 0, []));
          });
        });
      });

      describe('with middle delete count', () => {
        describe('with 0 start index', () => {
          it('removes count elements', () => {
            splice(array, 0, 3, []);
            nativeSplice(comparisonArray, 0, 3, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 0, 3, []))
              .to.deep.equal(nativeSplice(comparisonArray, 0, 3, []));
          });
        });

        describe('with middle start index', () => {
          it('removes count elements', () => {
            splice(array, 3, 3, []);
            nativeSplice(comparisonArray, 3, 3, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 3, 3, []))
              .to.deep.equal(nativeSplice(comparisonArray, 3, 3, []));
          });
        });

        describe('with high start index', () => {
          it('does not alter array', () => {
            splice(array, array.length + 1, 3, []);
            nativeSplice(comparisonArray, comparisonArray.length + 1, 3, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, 3, []))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, 3, []));
          });
        });

        describe('with negative start index', () => {
          it('removes count elements from the end of the array', () => {
            splice(array, -2, 3, []);
            nativeSplice(comparisonArray, -2, 3, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, -2, 3, []))
              .to.deep.equal(nativeSplice(comparisonArray, -2, 3, []));
          });
        });

        describe('with very negative start index', () => {
          it('removes count elements', () => {
            splice(array, -array.length - 1, 3, []);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, 3, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removes elements', () => {
            expect(splice(array, -array.length - 1, 3, []))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, 3, []));
          });
        });

        describe('with odd start index', () => {
          it('removes count elements', () => {
            splice(array, null, 3, []);
            nativeSplice(comparisonArray, null, 3, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removes elements', () => {
            expect(splice(array, null, 3, []))
              .to.deep.equal(nativeSplice(comparisonArray, null, 3, []));
          });
        });
      });

      describe('with high delete count', () => {
        describe('with 0 start index', () => {
          it('removes everything', () => {
            splice(array, 0, array.length, []);
            nativeSplice(comparisonArray, 0, comparisonArray.length, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns everything', () => {
            expect(splice(array, 0, array.length, []))
              .to.deep.equal(nativeSplice(comparisonArray, 0, comparisonArray.length, []));
          });
        });

        describe('with middle start index', () => {
          it('removes everything after index', () => {
            splice(array, 3, array.length, []);
            nativeSplice(comparisonArray, 3, comparisonArray.length, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 3, array.length, []))
              .to.deep.equal(nativeSplice(comparisonArray, 3, comparisonArray.length, []));
          });
        });

        describe('with high start index', () => {
          it('does not alter array', () => {
            splice(array, array.length + 1, array.length, []);
            nativeSplice(comparisonArray, comparisonArray.length + 1, comparisonArray.length, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, array.length, []))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, comparisonArray.length, []));
          });
        });

        describe('with negative start index', () => {
          it('removes everything after count from end', () => {
            splice(array, -2, array.length, []);
            nativeSplice(comparisonArray, -2, comparisonArray.length, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('removed elements', () => {
            expect(splice(array, -2, array.length, []))
              .to.deep.equal(nativeSplice(comparisonArray, -2, comparisonArray.length, []));
          });
        });

        describe('with very negative start index', () => {
          it('removes everything', () => {
            splice(array, -array.length - 1, array.length, []);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, comparisonArray.length, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns everything', () => {
            expect(splice(array, -array.length - 1, array.length, []))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, comparisonArray.length, []));
          });
        });

        describe('with odd start index', () => {
          it('removes everything', () => {
            splice(array, null, array.length, []);
            nativeSplice(comparisonArray, null, comparisonArray.length, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns everything', () => {
            expect(splice(array, null, array.length, []))
              .to.deep.equal(nativeSplice(comparisonArray, null, comparisonArray.length, []));
          });
        });
      });

      describe('with negative delete count', () => {
        describe('with 0 start index', () => {
          it('does not alter array', () => {
            splice(array, 0, -1, []);
            nativeSplice(comparisonArray, 0, -1, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 0, -1, []))
              .to.deep.equal(nativeSplice(comparisonArray, 0, -1, []));
          });
        });

        describe('with middle start index', () => {
          it('does not alter array', () => {
            splice(array, 3, -1, []);
            nativeSplice(comparisonArray, 3, -1, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 3, -1, []))
              .to.deep.equal(nativeSplice(comparisonArray, 3, -1, []));
          });
        });

        describe('with high start index', () => {
          it('does not alter array', () => {
            splice(array, array.length + 1, -1, []);
            nativeSplice(comparisonArray, comparisonArray.length + 1, -1, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, -1, []))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, -1, []));
          });
        });

        describe('with negative start index', () => {
          it('does not alter array', () => {
            splice(array, -2, -1, []);
            nativeSplice(comparisonArray, -2, -1, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -2, -1, []))
              .to.deep.equal(nativeSplice(comparisonArray, -2, -1, []));
          });
        });

        describe('with very negative start index', () => {
          it('does not alter array', () => {
            splice(array, -array.length - 1, -1, []);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, -1, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -array.length - 1, -1, []))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, -1, []));
          });
        });

        describe('with odd start index', () => {
          it('does not alter array', () => {
            splice(array, null, -1, []);
            nativeSplice(comparisonArray, null, -1, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, null, -1, []))
              .to.deep.equal(nativeSplice(comparisonArray, null, -1, []));
          });
        });
      });

      describe('with odd delete count', () => {
        describe('with 0 start index', () => {
          it('does not alter array', () => {
            splice(array, 0, null, []);
            nativeSplice(comparisonArray, 0, null, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 0, null, []))
              .to.deep.equal(nativeSplice(comparisonArray, 0, null, []));
          });
        });

        describe('with middle start index', () => {
          it('does not alter array', () => {
            splice(array, 3, null, []);
            nativeSplice(comparisonArray, 3, null, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 3, null, []))
              .to.deep.equal(nativeSplice(comparisonArray, 3, null, []));
          });
        });

        describe('with high start index', () => {
          it('does not alter array', () => {
            splice(array, array.length + 1, null, []);
            nativeSplice(comparisonArray, comparisonArray.length + 1, null, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, null, []))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, null, []));
          });
        });

        describe('with negative start index', () => {
          it('does not alter array', () => {
            splice(array, -2, null, []);
            nativeSplice(comparisonArray, -2, null, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -2, null, []))
              .to.deep.equal(nativeSplice(comparisonArray, -2, null, []));
          });
        });

        describe('with very negative start index', () => {
          it('does not alter array', () => {
            splice(array, -array.length - 1, null, []);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, null, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -array.length - 1, null, []))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, null, []));
          });
        });

        describe('with odd start index', () => {
          it('does not alter array', () => {
            splice(array, null, null, []);
            nativeSplice(comparisonArray, null, null, []);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, null, null, []))
              .to.deep.equal(nativeSplice(comparisonArray, null, null, []));
          });
        });
      });
    });

    describe('with small insert count', () => {
      describe('with 0 delete count', () => {
        describe('with 0 start index', () => {
          it('inserts elements', () => {
            splice(array, 0, 0, [6, 7]);
            nativeSplice(comparisonArray, 0, 0, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 0, 0, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, 0, [6, 7]));
          });
        });

        describe('with middle start index', () => {
          it('inserts elements after index', () => {
            splice(array, 3, 0, [6, 7]);
            nativeSplice(comparisonArray, 3, 0, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 3, 0, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, 0, [6, 7]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, 0, [6, 7]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, 0, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, 0, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, 0, [6, 7]));
          });
        });

        describe('with negative start index', () => {
          it('inserts elements', () => {
            splice(array, -2, 0, [6, 7]);
            nativeSplice(comparisonArray, -2, 0, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -2, 0, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, -2, 0, [6, 7]));
          });
        });

        describe('with very negative start index', () => {
          it('inserts elements', () => {
            splice(array, -array.length - 1, 0, [6, 7]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, 0, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -array.length - 1, 0, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, 0, [6, 7]));
          });
        });

        describe('with odd start index', () => {
          it('inserts elements', () => {
            splice(array, null, 0, [6, 7]);
            nativeSplice(comparisonArray, null, 0, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, null, 0, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, null, 0, [6, 7]));
          });
        });
      });

      describe('with middle delete count', () => {
        describe('with 0 start index', () => {
          it('removes and inserts elements', () => {
            splice(array, 0, 3, [6, 7]);
            nativeSplice(comparisonArray, 0, 3, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 0, 3, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, 3, [6, 7]));
          });
        });

        describe('with middle start index', () => {
          it('removes and inserts elements after index', () => {
            splice(array, 3, 3, [6, 7]);
            nativeSplice(comparisonArray, 3, 3, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 3, 3, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, 3, [6, 7]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, 3, [6, 7]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, 3, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, 3, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, 3, [6, 7]));
          });
        });

        describe('with negative start index', () => {
          it('removes and inserts elements', () => {
            splice(array, -2, 3, [6, 7]);
            nativeSplice(comparisonArray, -2, 3, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, -2, 3, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, -2, 3, [6, 7]));
          });
        });

        describe('with very negative start index', () => {
          it('removes and inserts elements', () => {
            splice(array, -array.length - 1, 3, [6, 7]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, 3, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, -array.length - 1, 3, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, 3, [6, 7]));
          });
        });

        describe('with odd start index', () => {
          it('removes and inserts elements', () => {
            splice(array, null, 3, [6, 7]);
            nativeSplice(comparisonArray, null, 3, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, null, 3, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, null, 3, [6, 7]));
          });
        });
      });

      describe('with high delete count', () => {
        describe('with 0 start index', () => {
          it('removes and inserts elements', () => {
            splice(array, 0, array.length, [6, 7]);
            nativeSplice(comparisonArray, 0, comparisonArray.length, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 0, array.length, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, comparisonArray.length, [6, 7]));
          });
        });

        describe('with middle start index', () => {
          it('removes and inserts elements', () => {
            splice(array, 3, array.length, [6, 7]);
            nativeSplice(comparisonArray, 3, comparisonArray.length, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 3, array.length, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, comparisonArray.length, [6, 7]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, array.length, [6, 7]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, comparisonArray.length, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, array.length, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, comparisonArray.length, [6, 7]));
          });
        });

        describe('with negative start index', () => {
          it('removes and inserts elements', () => {
            splice(array, -3, array.length, [6, 7]);
            nativeSplice(comparisonArray, -3, comparisonArray.length, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, -3, array.length, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, -3, comparisonArray.length, [6, 7]));
          });
        });

        describe('with very negative start index', () => {
          it('removes and inserts elements', () => {
            splice(array, -array.length - 1, array.length, [6, 7]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, comparisonArray.length, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns everything', () => {
            expect(splice(array, -array.length - 1, array.length, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, comparisonArray.length, [6, 7]));
          });
        });

        describe('with odd start index', () => {
          it('removes and inserts elements', () => {
            splice(array, null, array.length, [6, 7]);
            nativeSplice(comparisonArray, null, comparisonArray.length, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns everything', () => {
            expect(splice(array, null, array.length, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, null, comparisonArray.length, [6, 7]));
          });
        });
      });

      describe('with negative delete count', () => {
        describe('with 0 start index', () => {
          it('inserts elements', () => {
            splice(array, 0, -1, [6, 7]);
            nativeSplice(comparisonArray, 0, -1, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 0, -1, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, -1, [6, 7]));
          });
        });

        describe('with middle start index', () => {
          it('inserts elements', () => {
            splice(array, 3, -1, [6, 7]);
            nativeSplice(comparisonArray, 3, -1, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 3, -1, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, -1, [6, 7]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, -1, [6, 7]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, -1, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, -1, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, -1, [6, 7]));
          });
        });

        describe('with negative start index', () => {
          it('inserts elements', () => {
            splice(array, -2, -1, [6, 7]);
            nativeSplice(comparisonArray, -2, -1, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -2, -1, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, -2, -1, [6, 7]));
          });
        });

        describe('with very negative start index', () => {
          it('inserts elements', () => {
            splice(array, -array.length - 1, -1, [6, 7]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, -1, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -array.length - 1, -1, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, -1, [6, 7]));
          });
        });

        describe('with odd start index', () => {
          it('inserts elements', () => {
            splice(array, null, -1, [6, 7]);
            nativeSplice(comparisonArray, null, -1, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, null, -1, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, null, -1, [6, 7]));
          });
        });
      });

      describe('with odd delete count', () => {
        describe('with 0 start index', () => {
          it('inserts elements', () => {
            splice(array, 0, null, [6, 7]);
            nativeSplice(comparisonArray, 0, null, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 0, null, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, null, [6, 7]));
          });
        });

        describe('with middle start index', () => {
          it('inserts elements', () => {
            splice(array, 3, null, [6, 7]);
            nativeSplice(comparisonArray, 3, null, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 3, null, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, null, [6, 7]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, null, [6, 7]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, null, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, null, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, null, [6, 7]));
          });
        });

        describe('with negative start index', () => {
          it('inserts elements', () => {
            splice(array, -2, null, [6, 7]);
            nativeSplice(comparisonArray, -2, null, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -2, null, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, -2, null, [6, 7]));
          });
        });

        describe('with very negative start index', () => {
          it('inserts elements', () => {
            splice(array, -array.length - 1, null, [6, 7]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, null, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -array.length - 1, null, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, null, [6, 7]));
          });
        });

        describe('with odd start index', () => {
          it('inserts elements', () => {
            splice(array, null, null, [6, 7]);
            nativeSplice(comparisonArray, null, null, [6, 7]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, null, null, [6, 7]))
              .to.deep.equal(nativeSplice(comparisonArray, null, null, [6, 7]));
          });
        });
      });
    });

    describe('with large insert count', () => {
      describe('with 0 delete count', () => {
        describe('with 0 start index', () => {
          it('inserts elements', () => {
            splice(array, 0, 0, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, 0, 0, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 0, 0, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, 0, [6, 7, 8, 9, 10]));
          });
        });

        describe('with middle start index', () => {
          it('inserts elements', () => {
            splice(array, 3, 0, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, 3, 0, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 3, 0, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, 0, [6, 7, 8, 9, 10]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, 0, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, 0, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, 0, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, 0, [6, 7, 8, 9, 10]));
          });
        });

        describe('with negative start index', () => {
          it('inserts elements', () => {
            splice(array, -2, 0, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, -2, 0, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -2, 0, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, -2, 0, [6, 7, 8, 9, 10]));
          });
        });

        describe('with very negative start index', () => {
          it('inserts elements', () => {
            splice(array, -array.length - 1, 0, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, 0, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -array.length - 1, 0, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, 0, [6, 7, 8, 9, 10]));
          });
        });

        describe('with odd start index', () => {
          it('inserts elements', () => {
            splice(array, null, 0, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, null, 0, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, null, 0, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, null, 0, [6, 7, 8, 9, 10]));
          });
        });
      });

      describe('with middle delete count', () => {
        describe('with 0 start index', () => {
          it('removes and inserts elements', () => {
            splice(array, 0, 3, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, 0, 3, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 0, 3, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, 3, [6, 7, 8, 9, 10]));
          });
        });

        describe('with middle start index', () => {
          it('removes and inserts elements', () => {
            splice(array, 3, 3, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, 3, 3, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 3, 3, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, 3, [6, 7, 8, 9, 10]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, 3, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, 3, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, 3, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, 3, [6, 7, 8, 9, 10]));
          });
        });

        describe('with negative start index', () => {
          it('removes and inserts elements', () => {
            splice(array, -2, 3, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, -2, 3, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, -2, 3, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, -2, 3, [6, 7, 8, 9, 10]));
          });
        });

        describe('with very negative start index', () => {
          it('removes and inserts elements', () => {
            splice(array, -array.length - 1, 3, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, 3, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, -array.length - 1, 3, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, 3, [6, 7, 8, 9, 10]));
          });
        });

        describe('with odd start index', () => {
          it('removes and inserts elements', () => {
            splice(array, null, 3, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, null, 3, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, null, 3, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, null, 3, [6, 7, 8, 9, 10]));
          });
        });
      });

      describe('with high delete count', () => {
        describe('with 0 start index', () => {
          it('removes and inserts elements', () => {
            splice(array, 0, array.length, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, 0, comparisonArray.length, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 0, array.length, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, comparisonArray.length, [6, 7, 8, 9, 10]));
          });
        });

        describe('with middle start index', () => {
          it('removes and inserts elements', () => {
            splice(array, 3, array.length, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, 3, comparisonArray.length, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 3, array.length, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, comparisonArray.length, [6, 7, 8, 9, 10]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, array.length, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, comparisonArray.length, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, array.length, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, comparisonArray.length, [6, 7, 8, 9, 10]));
          });
        });

        describe('with negative start index', () => {
          it('removes and inserts elements', () => {
            splice(array, -2, array.length, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, -2, comparisonArray.length, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, -2, array.length, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, -2, comparisonArray.length, [6, 7, 8, 9, 10]));
          });
        });

        describe('with very negative start index', () => {
          it('removes and inserts elements', () => {
            splice(array, -array.length - 1, array.length, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, comparisonArray.length, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns everything', () => {
            expect(splice(array, -array.length - 1, array.length, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, comparisonArray.length, [6, 7, 8, 9, 10]));
          });
        });

        describe('with odd start index', () => {
          it('removes and inserts elements', () => {
            splice(array, null, array.length, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, null, comparisonArray.length, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns everything', () => {
            expect(splice(array, null, array.length, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, null, comparisonArray.length, [6, 7, 8, 9, 10]));
          });
        });
      });

      describe('with negative delete count', () => {
        describe('with 0 start index', () => {
          it('inserts elements', () => {
            splice(array, 0, -1, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, 0, -1, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 0, -1, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, -1, [6, 7, 8, 9, 10]));
          });
        });

        describe('with middle start index', () => {
          it('inserts elements', () => {
            splice(array, 3, -1, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, 3, -1, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 3, -1, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, -1, [6, 7, 8, 9, 10]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, -1, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, -1, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, -1, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, -1, [6, 7, 8, 9, 10]));
          });
        });

        describe('with negative start index', () => {
          it('inserts elements', () => {
            splice(array, -2, -1, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, -2, -1, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -2, -1, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, -2, -1, [6, 7, 8, 9, 10]));
          });
        });

        describe('with very negative start index', () => {
          it('inserts elements', () => {
            splice(array, -array.length - 1, -1, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, -1, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -array.length - 1, -1, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, -1, [6, 7, 8, 9, 10]));
          });
        });

        describe('with odd start index', () => {
          it('inserts elements', () => {
            splice(array, null, -1, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, null, -1, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, null, -1, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, null, -1, [6, 7, 8, 9, 10]));
          });
        });
      });

      describe('with odd delete count', () => {
        describe('with 0 start index', () => {
          it('inserts elements', () => {
            splice(array, 0, null, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, 0, null, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 0, null, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, null, [6, 7, 8, 9, 10]));
          });
        });

        describe('with middle start index', () => {
          it('inserts elements', () => {
            splice(array, 3, null, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, 3, null, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 3, null, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, null, [6, 7, 8, 9, 10]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, null, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, null, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, null, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, null, [6, 7, 8, 9, 10]));
          });
        });

        describe('with negative start index', () => {
          it('inserts elements', () => {
            splice(array, -2, null, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, -2, null, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -2, null, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, -2, null, [6, 7, 8, 9, 10]));
          });
        });

        describe('with very negative start index', () => {
          it('inserts elements', () => {
            splice(array, -array.length - 1, null, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, null, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -array.length - 1, null, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, null, [6, 7, 8, 9, 10]));
          });
        });

        describe('with odd start index', () => {
          it('inserts elements', () => {
            splice(array, null, null, [6, 7, 8, 9, 10]);
            nativeSplice(comparisonArray, null, null, [6, 7, 8, 9, 10]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, null, null, [6, 7, 8, 9, 10]))
              .to.deep.equal(nativeSplice(comparisonArray, null, null, [6, 7, 8, 9, 10]));
          });
        });
      });
    });

    describe('with very large insert count', () => {
      describe('with 0 delete count', () => {
        describe('with 0 start index', () => {
          it('inserts elements', () => {
            splice(array, 0, 0, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, 0, 0, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 0, 0, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, 0, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with middle start index', () => {
          it('inserts elements', () => {
            splice(array, 3, 0, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, 3, 0, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 3, 0, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, 0, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, 0, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, 0, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, 0, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, 0, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with negative start index', () => {
          it('inserts elements', () => {
            splice(array, -2, 0, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, -2, 0, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -2, 0, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, -2, 0, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with very negative start index', () => {
          it('inserts elements', () => {
            splice(array, -array.length - 1, 0, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, 0, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -array.length - 1, 0, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, 0, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with odd start index', () => {
          it('inserts elements', () => {
            splice(array, null, 0, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, null, 0, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, null, 0, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, null, 0, [6, 7, 8, 9, 10, 11, 12]));
          });
        });
      });

      describe('with middle delete count', () => {
        describe('with 0 start index', () => {
          it('removes and inserts elements', () => {
            splice(array, 0, 3, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, 0, 3, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 0, 3, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, 3, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with middle start index', () => {
          it('removes and inserts elements', () => {
            splice(array, 3, 3, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, 3, 3, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 3, 3, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, 3, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, 3, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, 3, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, 3, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, 3, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with negative start index', () => {
          it('removes and inserts elements', () => {
            splice(array, -2, 3, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, -2, 3, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, -2, 3, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, -2, 3, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with very negative start index', () => {
          it('removes and inserts elements', () => {
            splice(array, -array.length - 1, 3, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, 3, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, -array.length - 1, 3, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, 3, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with odd start index', () => {
          it('removes and inserts elements', () => {
            splice(array, null, 3, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, null, 3, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, null, 3, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, null, 3, [6, 7, 8, 9, 10, 11, 12]));
          });
        });
      });

      describe('with high delete count', () => {
        describe('with 0 start index', () => {
          it('removes and inserts elements', () => {
            splice(array, 0, array.length, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, 0, comparisonArray.length, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 0, array.length, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, comparisonArray.length, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with middle start index', () => {
          it('removes and inserts elements', () => {
            splice(array, 3, array.length, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, 3, comparisonArray.length, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, 3, array.length, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, comparisonArray.length, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, array.length, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, comparisonArray.length, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, array.length, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, comparisonArray.length, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with negative start index', () => {
          it('removes and inserts elements', () => {
            splice(array, -2, array.length, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, -2, comparisonArray.length, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns removed elements', () => {
            expect(splice(array, -2, array.length, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, -2, comparisonArray.length, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with very negative start index', () => {
          it('removes and inserts elements', () => {
            splice(array, -array.length - 1, array.length, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, comparisonArray.length, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns everything', () => {
            expect(splice(array, -array.length - 1, array.length, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, comparisonArray.length, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with odd start index', () => {
          it('removes and inserts elements', () => {
            splice(array, null, array.length, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, null, comparisonArray.length, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns everything', () => {
            expect(splice(array, null, array.length, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, null, comparisonArray.length, [6, 7, 8, 9, 10, 11, 12]));
          });
        });
      });

      describe('with negative delete count', () => {
        describe('with 0 start index', () => {
          it('inserts elements', () => {
            splice(array, 0, -1, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, 0, -1, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 0, -1, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, -1, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with middle start index', () => {
          it('inserts elements', () => {
            splice(array, 3, -1, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, 3, -1, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 3, -1, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, -1, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, -1, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, -1, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, -1, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, -1, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with negative start index', () => {
          it('inserts elements', () => {
            splice(array, -2, -1, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, -2, -1, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -2, -1, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, -2, -1, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with very negative start index', () => {
          it('inserts elements', () => {
            splice(array, -array.length - 1, -1, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, -1, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -array.length - 1, -1, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, -1, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with odd start index', () => {
          it('inserts elements', () => {
            splice(array, null, -1, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, null, -1, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, null, -1, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, null, -1, [6, 7, 8, 9, 10, 11, 12]));
          });
        });
      });

      describe('with odd delete count', () => {
        describe('with 0 start index', () => {
          it('inserts elements', () => {
            splice(array, 0, null, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, 0, null, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 0, null, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, 0, null, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with middle start index', () => {
          it('inserts elements', () => {
            splice(array, 3, null, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, 3, null, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, 3, null, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, 3, null, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with high start index', () => {
          it('inserts elements', () => {
            splice(array, array.length + 1, null, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, comparisonArray.length + 1, null, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, array.length + 1, null, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, comparisonArray.length + 1, null, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with negative start index', () => {
          it('inserts elements', () => {
            splice(array, -2, null, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, -2, null, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -2, null, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, -2, null, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with very negative start index', () => {
          it('inserts elements', () => {
            splice(array, -array.length - 1, null, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, -comparisonArray.length - 1, null, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, -array.length - 1, null, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, -comparisonArray.length - 1, null, [6, 7, 8, 9, 10, 11, 12]));
          });
        });

        describe('with odd start index', () => {
          it('inserts elements', () => {
            splice(array, null, null, [6, 7, 8, 9, 10, 11, 12]);
            nativeSplice(comparisonArray, null, null, [6, 7, 8, 9, 10, 11, 12]);
            expect(array).to.deep.equal(comparisonArray);
          });

          it('returns empty array', () => {
            expect(splice(array, null, null, [6, 7, 8, 9, 10, 11, 12]))
              .to.deep.equal(nativeSplice(comparisonArray, null, null, [6, 7, 8, 9, 10, 11, 12]));
          });
        });
      });
    });
  });
});
