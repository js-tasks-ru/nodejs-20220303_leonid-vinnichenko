const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0])
        .to.have.property('error')
        .and.to.be.equal('too short, expect 10, got 6');
    });
  });

  it('check unknown type validation', () => {
    const validator = new Validator({
      name: {
        type: 'string',
        min: 10,
        max: 20,
      },
    });

    const errors = validator.validate({ name: [] });

    expect(errors).to.have.length(1);
    expect(errors[0]).to.have.property('field').and.to.be.equal('name');
    expect(errors[0])
      .to.have.property('error')
      .and.to.be.equal('expect string, got object');
  });

  it('check min string length', () => {
    const validator = new Validator({
      name: {
        type: 'string',
        min: 10,
        max: 20,
      },
    });

    const errors = validator.validate({ name: 'hi' });

    expect(errors).to.have.length(1);
    expect(errors[0]).to.have.property('field').and.to.be.equal('name');
    expect(errors[0])
      .to.have.property('error')
      .and.to.be.equal('too short, expect 10, got 2');
  });

  it('check max string length', () => {
    const validator = new Validator({
      name: {
        type: 'string',
        min: 1,
        max: 4,
      },
    });

    const errors = validator.validate({ name: 'hello' });

    expect(errors).to.have.length(1);
    expect(errors[0]).to.have.property('field').and.to.be.equal('name');
    expect(errors[0])
      .to.have.property('error')
      .and.to.be.equal('too long, expect 4, got 5');
  });

  it('should has number type', () => {
    const validator = new Validator({
      name: {
        type: 'number',
        min: 1,
        max: 4,
      },
    });

    const errors = validator.validate({ name: 's' });

    expect(errors).to.have.length(1);
    expect(errors[0]).to.have.property('field').and.to.be.equal('name');
    expect(errors[0])
      .to.have.property('error')
      .and.to.be.equal('expect number, got string');
  });

  it('check min number', () => {
    const validator = new Validator({
      name: {
        type: 'number',
        min: 10,
        max: 20,
      },
    });

    const errors = validator.validate({ name: 3 });

    expect(errors).to.have.length(1);
    expect(errors[0]).to.have.property('field').and.to.be.equal('name');
    expect(errors[0])
      .to.have.property('error')
      .and.to.be.equal('too little, expect 10, got 3');
  });

  it('check max number', () => {
    const validator = new Validator({
      name: {
        type: 'number',
        min: 10,
        max: 20,
      },
    });

    const errors = validator.validate({ name: 21 });

    expect(errors).to.have.length(1);
    expect(errors[0]).to.have.property('field').and.to.be.equal('name');
    expect(errors[0])
      .to.have.property('error')
      .and.to.be.equal('too big, expect 20, got 21');
  });

  it('check multiple errors', () => {
    const validator = new Validator({
      name: {
        type: 'string',
        min: 2,
        max: 30,
      },
      age: {
        type: 'number',
        min: 1,
        max: 150,
      },
    });

    const errors = validator.validate({ name: 'i', age: 200 });

    expect(errors).to.have.length(2);

    expect(errors[0]).to.have.property('field').and.to.be.equal('name');
    expect(errors[0])
      .to.have.property('error')
      .and.to.be.equal('too short, expect 2, got 1');

    expect(errors[1]).to.have.property('field').and.to.be.equal('age');
    expect(errors[1])
      .to.have.property('error')
      .and.to.be.equal('too big, expect 150, got 200');
  });
});
