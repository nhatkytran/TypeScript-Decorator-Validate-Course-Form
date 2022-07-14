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
var Conditions;
(function (Conditions) {
    Conditions[Conditions["REQUIRE"] = 0] = "REQUIRE";
    Conditions[Conditions["MIN_LENGTH"] = 1] = "MIN_LENGTH";
    Conditions[Conditions["POSITIVE"] = 2] = "POSITIVE";
})(Conditions || (Conditions = {}));
const validators = {};
function validatorsRegister(blueprint, key, conditions) {
    conditions.sort((a, b) => a - b);
    if (validators[blueprint]) {
        validators[blueprint] = {
            ...validators[blueprint],
            [key]: conditions,
        };
    }
    else {
        validators[blueprint] = {
            [key]: conditions,
        };
    }
}
function conditionsDecorator(conditions) {
    return (target, propName) => {
        const blueprint = target.constructor.name;
        validatorsRegister(blueprint, propName, conditions);
    };
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
    conditionsDecorator([Conditions.REQUIRE, Conditions.MIN_LENGTH])
], Course.prototype, "title", void 0);
__decorate([
    conditionsDecorator([Conditions.POSITIVE])
], Course.prototype, "price", void 0);
function validate(obj) {
    const blueprint = obj.constructor.name;
    const validatorConditions = validators[blueprint];
    return Object.entries(validatorConditions).every(([key, conditions]) => {
        return conditions.every((condition) => {
            if (condition === Conditions.REQUIRE) {
                if (!obj[key].trim().length) {
                    alert(`[${key}]: Input can not be all blank spaces`);
                    return false;
                }
                return true;
            }
            if (condition === Conditions.MIN_LENGTH) {
                const lengthCondition = 3;
                if (obj[key].length < lengthCondition) {
                    alert(`[${key}]: Input's length must be greater than or equal to ${lengthCondition}`);
                    return false;
                }
                return true;
            }
            if (condition === Conditions.POSITIVE) {
                if (obj[key] <= 0) {
                    alert(`[${key}]: Input must be positive`);
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
        alert("Empty Input!");
        return;
    }
    if (!price) {
        alert("Price must be a number");
        return;
    }
    const newCourse = new Course(title, price);
    const valid = validate(newCourse);
    if (valid) {
        alert("Create course successfully!");
        console.log(newCourse);
    }
});
