const courseForm = document.querySelector(".course-form") as HTMLFormElement;
const courseTitle = document.querySelector(".course-title") as HTMLInputElement;
const coursePrice = document.querySelector(".course-price") as HTMLInputElement;

interface ValidatorsInterface {
  [blueprint: string]: {
    [key: string]: Conditions[];
  };
}

enum Conditions {
  REQUIRE,
  MIN_LENGTH,
  POSITIVE,
}

const validators: ValidatorsInterface = {};

function validatorsRegister(
  blueprint: string,
  key: string,
  conditions: Conditions[]
) {
  conditions.sort((a, b) => a - b);

  if (validators[blueprint]) {
    validators[blueprint] = {
      ...validators[blueprint],
      [key]: conditions,
    };
  } else {
    validators[blueprint] = {
      [key]: conditions,
    };
  }
}

function conditionsDecorator(conditions: Conditions[]) {
  return (target: object, propName: string) => {
    const blueprint = target.constructor.name;
    validatorsRegister(blueprint, propName, conditions);
  };
}

class Course {
  @conditionsDecorator([Conditions.REQUIRE, Conditions.MIN_LENGTH])
  title: string;

  @conditionsDecorator([Conditions.POSITIVE])
  price: number;

  constructor(title: string, price: number) {
    this.title = title;
    this.price = price;
  }
}

function validate(obj: any): boolean {
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
          alert(
            `[${key}]: Input's length must be greater than or equal to ${lengthCondition}`
          );
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
