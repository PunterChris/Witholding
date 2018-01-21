/*
* EstimatorJS 0.0.1 - Australian Tax Payable Estimator
* Copyright (c) 2017 Sean Darcy (Darcys22@gmail.com)
* Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
* THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function (name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
  else if (typeof define === 'function' && define.amd) { define(definition); }
  else { context[name] = definition(); }
})('Withholder', this, function () {
  'use strict';

  var Withholder = function (options) {
    var nativeForEach, nativeMap;
    nativeForEach = Array.prototype.forEach;
    nativeMap = Array.prototype.map;

    this.each = function (obj, iterator, context) {
      if (obj === null) {
        return;
      }
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === {}) return;
        }
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (iterator.call(context, obj[key], key, obj) === {}) return;
          }
        }
      }
    };

    this.map = function(obj, iterator, context) {
      var results = [];
      // Not using strict equality so that this acts as a
      // shortcut to checking for `null` and `undefined`.
      if (obj == null) return results;
      if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
      this.each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });
      return results;
    };

    if (typeof options == 'object'){
      //this.hasher = options.hasher;
    } else if(typeof options == 'function'){
      //this.hasher = options;
    }
  };

  Withholder.prototype = {

    calculateTaxWithholding: function (taxableIncome, yearPeriods, year) {
      var weeklyIncome = taxableIncome*yearPeriods/52
      var a,b;

      this.coefficients(weeklyIncome, year, 0)


      return this.round((this.a*(Math.floor(weeklyIncome) + 0.99) - this.b)*52/yearPeriods,0);

		},

    round: function(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
		}, 

    coefficients: function(weeklyIncome, year, settings) {
      if (year == 2018){
      } else {
        if (weeklyIncome < 355) { 
          this.a = 0;
          this.b = 0;
        } else if (weeklyIncome < 416) { 
          this.a = 0.19;
          this.b = 67.4635;
        } else if (weeklyIncome < 520) { 
          this.a = 0.29;
          this.b = 109.1077;
        } else if (weeklyIncome < 711) { 
          this.a = 0.21;
          this.b = 67.4646;
        } else if (weeklyIncome < 1282) { 
          this.a = 0.3477;
          this.b = 165.4435;
        } else if (weeklyIncome < 1673) { 
          this.a = 0.3450;
          this.b = 161.9819;
        } else if (weeklyIncome < 3461) { 
          this.a = 0.39;
          this.b = 237.2704;
        } else { 
          this.a = 0.47;
          this.b = 514.1935;
        } 
      }

		}

  };


  return Withholder;

});
