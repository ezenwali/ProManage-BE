import { ValueObject } from 'src/common/database/ValueObject';

export class Stage extends ValueObject {
  private constructor(
    private name: string,
    private readonly type: 'default' | 'created',
  ) {
    super();
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  static create(name: string, type: 'default' | 'created' = 'default') {
    return new Stage(name, type);
  }

  public equals(obj: Stage): boolean {
    return this.name.toLowerCase() === obj.name.toLowerCase();
  }
}
