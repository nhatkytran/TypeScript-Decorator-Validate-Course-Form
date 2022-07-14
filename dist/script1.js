"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const courseForm = document.querySelector(".course-form");
const courseTitle = document.querySelector(".course-title");
const coursePrice = document.querySelector(".course-price");
const validators = {};
function validatorsRegisterHelper(blueprintName, key, condition) {
    let newConditions;
    if (key in validators[blueprintName]) {
        newConditions = [...validators[blueprintName][key], condition];
        newConditions.sort((a, b) => a - b);
    }
    else {
        newConditions = [condition];
    }
    return {
        ...validators[blueprintName],
        [key]: newConditions,
    };
}
function validatorsRegister(blueprintName, key, condition) {
    if (validators[blueprintName]) {
        validators[blueprintName] = validatorsRegisterHelper(blueprintName, key, condition);
    }
    else {
        validators[blueprintName] = { [key]: [condition] };
    }
}
var Conditions;
(function (Conditions) {
    Conditions[Conditions["REQUIRED"] = 0] = "REQUIRED";
    Conditions[Conditions["MIN_LENGTH"] = 1] = "MIN_LENGTH";
    Conditions[Conditions["POSITIVE"] = 2] = "POSITIVE";
})(Conditions || (Conditions = {}));
function Required(target, propName) {
    const blueprintName = target.constructor.name;
    validatorsRegister(blueprintName, propName, Conditions.REQUIRED);
}
function MinLength(target, propName) {
    const blueprintName = target.constructor.name;
    validatorsRegister(blueprintName, propName, Conditions.MIN_LENGTH);
}
function Positive(target, propName) {
    const blueprintName = target.constructor.name;
    validatorsRegister(blueprintName, propName, Conditions.POSITIVE);
}
class Course {
    title;
    price;
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }
}
__decorate([
    Required,
    MinLength
], Course.prototype, "title", void 0);
__decorate([
    Positive
], Course.prototype, "price", void 0);
function validate(obj) {
    const blueprintName = obj.constructor.name;
    const validatorCondtions = validators[blueprintName];
    return Object.entries(validatorCondtions).every(([key, conditions]) => {
        return conditions.every((condition) => {
            if (condition === Conditions.REQUIRED) {
                if (!obj.title.trim().length) {
                    alert(`[${key}]: Input can't be all blank spaces`);
                    return false;
                }
                return true;
            }
            if (condition === Conditions.MIN_LENGTH) {
                const lengthCondition = 3;
                if (obj.title.length < 3) {
                    alert(`[${key}]: Input's length must be greater than or equal to ${lengthCondition}`);
                    return false;
                }
                return true;
            }
            if (condition === Conditions.POSITIVE) {
                if (obj[key] <= 0) {
                    alert(`[${key}]: Input's value must be positive`);
                    return false;
                }
                return true;
            }
        });
    });
}
courseForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = courseTitle.value;
    const price = Number.parseFloat(coursePrice.value);
    if (!title) {
        alert("Empty input");
        return;
    }
    if (!price) {
        alert("Price must be a number!");
        return;
    }
    const newCourse = new Course(title, price);
    const valid = validate(newCourse);
    if (valid) {
        alert("Create course successfully");
        console.log(newCourse);
    }
});
