const courseForm = document.querySelector(".course-form") as HTMLFormElement;
const courseTitle = document.querySelector(".course-title") as HTMLInputElement;
const coursePrice = document.querySelector(".course-price") as HTMLInputElement;

interface ValidatorsInterface {
  [blueprint: string]: {
    [conditions: string]: Conditions[];
  };
}

const validators: ValidatorsInterface = {};

function validatorsRegisterHelper(
  blueprintName: string,
  key: string,
  condition: Conditions
): { [key: string]: Conditions[] } {
  let newConditions: Conditions[];

  if (key in validators[blueprintName]) {
    newConditions = [...validators[blueprintName][key], condition];
    newConditions.sort((a, b) => a - b);
  } else {
    newConditions = [condition];
  }

  return {
    ...validators[blueprintName],
    [key]: newConditions,
  };
}

function validatorsRegister(
  blueprintName: string,
  key: string,
  condition: Conditions
) {
  if (validators[blueprintName]) {
    validators[blueprintName] = validatorsRegisterHelper(
      blueprintName,
      key,
      condition
    );
  } else {
    validators[blueprintName] = { [key]: [condition] };
  }
}

enum Conditions {
  REQUIRE,
  MIN_LENGTH,
  POSITIVE,
}

function Require(target: object, propName: string) {
  const blueprintName = target.constructor.name;
  validatorsRegister(blueprintName, propName, Conditions.REQUIRE);
}

function MinLength(target: object, propName: string) {
  const blueprintName = target.constructor.name;
  validatorsRegister(blueprintName, propName, Conditions.MIN_LENGTH);
}

function Positive(target: object, propName: string) {
  const blueprintName = target.constructor.name;
  validatorsRegister(blueprintName, propName, Conditions.POSITIVE);
}

class Course {
  @Require @MinLength title: string;
  @Positive price: number;

  constructor(title: string, price: number) {
    this.title = title;
    this.price = price;
  }
}

function validate(obj: any): boolean {
  const blueprintName: string = obj.constructor.name;
  const validatorCondtions = validators[blueprintName];

  return Object.entries(validatorCondtions).every(([key, conditions]) => {
    return conditions.every((condition) => {
      if (condition === Conditions.REQUIRE) {
        if (!obj.title.trim().length) {
          alert(`[${key}]: Input can't be all blank spaces`);
          return false;
        }
        return true;
      }
      if (condition === Conditions.MIN_LENGTH) {
        const lengthCondition = 3;
        if (obj.title.length < 3) {
          alert(
            `[${key}]: Input's length must be greater than or equal to ${lengthCondition}`
          );
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
  const valid: boolean = validate(newCourse);

  if (valid) {
    alert("Create course successfully");
    console.log(newCourse);
  }
});
