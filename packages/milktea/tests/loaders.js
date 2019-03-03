import * as process from 'process';
import { expect } from 'chai';
import loaders from '../lib/loaders/loaders';

const sweetOptions: object = {
  basicPath: process.cwd()
};

describe('loaders', function(): void {
  describe('js', function(): void {
    it('js Configuration is correct', function(): void {
      const loadersArr: object[] = loaders({}, sweetOptions);
      const use: object[] = loadersArr[0].use;
      const { options }: { options: object } = use[0];
      const { plugins, presets }: { plugins: any[]; presets: any[] } = options;

      expect(use).to.be.an('array');
      expect(options).to.be.an('object');
      expect(plugins).to.be.an('array');
      expect(presets).to.be.an('array');
    });

    it('ecmascript Configuration is correct', function(): void {
      const loadersArr: object[] = loaders({ js: { ecmascript: true } }, sweetOptions);
      const use: object[] = loadersArr[0].use;
      const { options }: { options: object } = use[0];
      const { presets }: { plugins: any[]; presets: any[] } = options;

      expect(presets[0]).to.not.be.an('array');
    });

    it('react Configuration is correct', function(): void {
      const loadersArr: object[] = loaders({ frame: 'react', mode: 'development' }, sweetOptions);
      const use: object[] = loadersArr[0].use;
      const { options }: { options: object } = use[0];
      const { plugins, presets }: { plugins: any[]; presets: any[] } = options;

      expect(plugins).to.include('react-hot-loader/babel');
      expect(presets).to.include('@babel/preset-react');
    });

    it('vue Configuration is correct', function(): void {
      const loadersArr: object[] = loaders({ frame: 'vue', mode: 'development' }, sweetOptions);
      const use: object[] = loadersArr[0].use;
      const { options }: { options: object } = use[0];
      const { plugins, presets }: { plugins: any[]; presets: any[] } = options;

      expect(loadersArr[loadersArr.length - 1].use).to.eql(['vue-loader']);
      expect(plugins).to.not.include('react-hot-loader/babel');
      expect(presets).to.not.include('@babel/preset-react');
    });
  });

  describe('sass', function(): void {
    it('mode Configuration is correct', function(): void {
      const devUse: object[] = loaders({ mode: 'development' }, sweetOptions)[1].use;
      const proUse: object[] = loaders({ mode: 'production' }, sweetOptions)[1].use;

      expect(devUse[2].options.outputStyle).to.equal('compact');
      expect(proUse[2].options.outputStyle).to.equal('compressed');
    });

    it('frame Configuration is correct', function(): void {
      const reactStyleUse: object[] = loaders({ mode: 'development', frame: 'react' }, sweetOptions)[1].use;
      const vueStyleOneOf: object[] = loaders({ mode: 'development', frame: 'vue' }, sweetOptions)[1].oneOf;

      expect(reactStyleUse).to.include('style-loader');
      expect(vueStyleOneOf[0].use).to.include('vue-style-loader');
      expect(vueStyleOneOf[1].use).to.include('vue-style-loader');
    });
  });

  describe('less', function(): void {
    it('frame Configuration is correct', function(): void {
      const reactStyleUse: object[] = loaders({ mode: 'development', frame: 'react' }, sweetOptions)[2].use;
      const vueStyleOneOf: object[] = loaders({ mode: 'development', frame: 'vue' }, sweetOptions)[2].oneOf;

      expect(reactStyleUse).to.include('style-loader');
      expect(vueStyleOneOf[0].use).to.include('vue-style-loader');
      expect(vueStyleOneOf[1].use).to.include('vue-style-loader');
    });
  });
});